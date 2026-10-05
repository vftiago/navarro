import type { IceCardInstance } from "../../cards/instance";
import { removePermanentEffect } from "../board";
import {
  addToIce,
  ALL_SERVERS,
  modifyServerSecurity,
  removeFromIce,
  type ServerName,
} from "../server";
import { incrementTurn, setTurnCurrentPhase, TurnPhase } from "../turn";
import type { GameState, ThunkAction } from "../types";
import { getRandomIceCard } from "../utils";

/**
 * Corp AI (Mark II tempo probe)
 *
 * The corp is a Slay the Spire enemy: a fixed, readable policy with no
 * hidden decision-making, so the player can learn its rhythm. Per corp turn:
 *
 * 1. Security +1, always. This is the clock and it never comes down.
 * 2. Every CORP_INSTALL_INTERVAL turns, install one random ice face-down on
 *    the outermost slot of the wall. The player sees the wall get thicker,
 *    not with what. It rezzes on first approach (runPhase's approachIce).
 * 3. If the wall is full the corp patches instead of installing: the
 *    outermost rezzed ice (the one the player learned most recently) is
 *    pulled and a fresh face-down ice takes the outermost slot. A wall of
 *    fully-known ice is never a stable state the player can farm. If every
 *    ice is still face-down there is nothing to patch and the corp passes.
 *
 * The corp never rezzes on its own turn. Information about the wall is
 * something the player pays for by diving, never something the corp gives
 * away. Tune the two constants below to feel different tempos.
 */

/** Install (or patch) every Nth turn. 1 = every corp turn. */
export const CORP_INSTALL_INTERVAL = 2;

export type CorpDecision =
  | { kind: "install" }
  | { kind: "pass" }
  | { kind: "patch"; replace: IceCardInstance };

/**
 * Pure policy: what the corp does with the wall this turn.
 * Exported so it can be unit-tested without a store.
 */
export const decideCorpAction = (
  state: GameState,
  server: ServerName,
): CorpDecision => {
  const { turnNumber } = state.turnState;
  if (turnNumber % CORP_INSTALL_INTERVAL !== 0) {
    return { kind: "pass" };
  }

  const { serverMaxIceSlots, servers } = state.serverState;
  const wall = servers[server].installedIce;

  if (wall.length < serverMaxIceSlots) {
    return { kind: "install" };
  }

  // Outermost ice is last in the array (encountered first in a run)
  const outermostRezzed = [...wall].reverse().find((ice) => ice.isRezzed);

  return outermostRezzed
    ? { kind: "patch", replace: outermostRezzed }
    : { kind: "pass" };
};

/**
 * Corp Phase - Consolidated single handler (no subphases)
 * Executes at the beginning of each turn (before player's Draw phase).
 */
export const corpPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    // The corp phase opens a new turn
    dispatch(incrementTurn());

    // The clock: security rises every turn, unconditionally
    dispatch(modifyServerSecurity(1));

    const state = getState();
    // Pick a random server to act on (currently only HQ)
    const server = ALL_SERVERS[Math.floor(Math.random() * ALL_SERVERS.length)];
    const decision = decideCorpAction(state, server);

    if (decision.kind === "patch") {
      dispatch(removeFromIce(decision.replace, server));
      // Drop any aura or scaling the removed ice registered when it rezzed
      dispatch(removePermanentEffect(decision.replace.instanceId));
    }

    if (decision.kind !== "pass") {
      /*
       * Face-down: no ON_REZ here. The ice reveals itself, and registers its
       * strength modifiers, when the player first approaches it in a run.
       */
      dispatch(addToIce(getRandomIceCard(), server));
    }

    if (import.meta.env.DEV) {
      console.debug(
        `[corp] turn ${String(getState().turnState.turnNumber)}: ${decision.kind}`,
      );
    }

    // Transition to Draw phase
    dispatch(setTurnCurrentPhase(TurnPhase.Draw));
  };
};
