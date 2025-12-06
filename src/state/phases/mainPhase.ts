import { TriggerMoment } from "../../cardDefinitions/card";
import { getPlayerInstalledPrograms } from "../player";
import { setTurnCurrentSubPhase, TurnSubPhase } from "../turn";
import type { ThunkAction } from "../types";
import { executeCardEffects, getCardEffectsByTrigger } from "../utils";

/**
 * Main phase is the player's action window.
 * This is a waiting state - the phase persists until the player:
 * - Plays a card (→ Play phase)
 * - Initiates a run (→ Run phase)
 * - Manually ends turn (→ End phase)
 */
export const startMainPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerPrograms = getPlayerInstalledPrograms(getState());

    playerPrograms.forEach((card) => {
      const turnStartEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_TURN_START,
      );

      executeCardEffects(turnStartEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processMainPhase = (): ThunkAction => {
  return () => {
    // Stay in Process subphase - waiting for player action
  };
};
