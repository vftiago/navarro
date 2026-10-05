import { hasKeywordFlag } from "../../cards/engine";
import { CardType } from "../../cards/enums";
import { resolveCard } from "../../cards/instance";
import {
  activateAbility,
  clickIce,
  initiateRun,
  playPhase,
  selectAccessedCard,
} from "../phases";
import { setSelectedServer } from "../server";
import { RunProgressState, setTurnCurrentPhase, TurnPhase } from "../turn";
import type { GameAction, GameState } from "../types";
import type { GameEvent } from "./eventBus";
import { GameEventType } from "./eventBus";

/**
 * Creates an event handler that translates game events into state updates.
 * This is the bridge between the event bus and the game state.
 *
 * A CARD_CLICKED event carries no intent — this resolver derives what the
 * click means from where the card lives and the current phase/run state,
 * validates it, and invokes the matching phase thunk. This is the single
 * authority on click rules; any checks in UI components are cosmetic
 * affordances only.
 */
export const createEventHandler = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => {
  // Helper to dispatch thunks with payload
  const dispatchThunk = <T>(
    thunkCreator: (
      payload: T,
    ) => (
      dispatch: (action: GameAction) => void,
      getState: () => GameState,
    ) => void,
    payload: T,
  ) => {
    thunkCreator(payload)(dispatch, getState);
  };

  // Helper to dispatch thunks without payload
  const dispatchThunkNoPayload = (
    thunkCreator: () => (
      dispatch: (action: GameAction) => void,
      getState: () => GameState,
    ) => void,
  ) => {
    thunkCreator()(dispatch, getState);
  };

  return (event: GameEvent) => {
    const state = getState();

    switch (event.type) {
      case GameEventType.CARD_CLICKED: {
        const { instanceId } = event.payload;
        const { runProgressState, turnCurrentPhase } = state.turnState;

        // Card in hand → play it (Main phase only)
        const handCard = state.playerState.playerHand.find(
          (card) => card.instanceId === instanceId,
        );
        if (handCard) {
          if (turnCurrentPhase !== TurnPhase.Main) {
            console.warn("Cannot play card outside Main phase");

            return;
          }
          if (hasKeywordFlag(resolveCard(handCard).keywords, "unplayable")) {
            console.warn("Card is unplayable");

            return;
          }
          if (import.meta.env.DEV) {
            console.log("[CARD_CLICKED] resolved: play card", instanceId);
          }
          dispatch(setTurnCurrentPhase(TurnPhase.Play));
          dispatchThunk(playPhase, { cardId: instanceId });

          return;
        }

        // Currently encountered ice → click through it
        if (
          state.serverState.serverCurrentEncounteredIce?.instanceId ===
          instanceId
        ) {
          if (
            turnCurrentPhase !== TurnPhase.Run ||
            runProgressState !== RunProgressState.ENCOUNTERING_ICE
          ) {
            console.warn("Cannot click ice outside run encounter state");

            return;
          }
          if (import.meta.env.DEV) {
            console.log("[CARD_CLICKED] resolved: click ice", instanceId);
          }
          dispatchThunk(clickIce, { iceId: instanceId });

          return;
        }

        // Accessed card → select it (access state only)
        const accessedCard = state.playerState.playerAccessedCards.find(
          (card) => card.instanceId === instanceId,
        );
        if (accessedCard) {
          if (
            turnCurrentPhase !== TurnPhase.Run ||
            runProgressState !== RunProgressState.ACCESSING_CARDS
          ) {
            console.warn("Cannot select card outside run access state");

            return;
          }
          if (import.meta.env.DEV) {
            console.log(
              "[CARD_CLICKED] resolved: select accessed card",
              instanceId,
            );
          }
          dispatchThunk(selectAccessedCard, { cardId: instanceId });

          return;
        }

        // Installed program → activate its ability (Main phase only)
        const installedProgram = state.playerState.playerInstalledPrograms.find(
          (card) => card.instanceId === instanceId,
        );
        if (installedProgram) {
          if (turnCurrentPhase !== TurnPhase.Main) {
            console.warn("Cannot activate an ability outside Main phase");

            return;
          }
          const definition = resolveCard(installedProgram);
          const ability =
            definition.type === CardType.PROGRAM
              ? definition.abilities?.[0]
              : undefined;
          if (!ability) {
            console.warn("Program has no activated ability");

            return;
          }
          if (
            (ability.cost.clicks ?? 0) > state.turnState.turnRemainingClicks
          ) {
            console.warn("Not enough clicks to activate ability");

            return;
          }
          if (import.meta.env.DEV) {
            console.log(
              "[CARD_CLICKED] resolved: activate ability",
              instanceId,
            );
          }
          dispatchThunk(activateAbility, { programId: instanceId });

          return;
        }

        // No interaction for this card in the current state — ignore
        console.warn("CARD_CLICKED: no interaction for card", instanceId);
        break;
      }

      case GameEventType.PLAYER_INITIATE_RUN: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot initiate run outside Main phase");

          return;
        }

        // Validate: Must have clicks remaining
        if (state.turnState.turnRemainingClicks <= 0) {
          console.warn("Cannot initiate run without clicks");

          return;
        }

        // initiateRun sets the phase to Run internally
        dispatchThunkNoPayload(initiateRun);
        break;
      }

      case GameEventType.PLAYER_SELECT_SERVER: {
        // Validate: the run target can only change outside a run
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot select a server outside Main phase");

          return;
        }

        dispatch(setSelectedServer(event.payload.server));
        break;
      }

      case GameEventType.PLAYER_END_TURN: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot end turn outside Main phase");

          return;
        }

        // Transition to End phase
        dispatch(setTurnCurrentPhase(TurnPhase.End));
        break;
      }

      default: {
        // TypeScript exhaustiveness check
        const _exhaustiveCheck: never = event;
        console.warn("Unhandled event type:", _exhaustiveCheck);
      }
    }
  };
};
