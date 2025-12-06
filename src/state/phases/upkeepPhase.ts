import { TriggerMoment } from "../../cardDefinitions/card";
import { getPlayerInstalledPrograms } from "../player";
import { setTurnCurrentPhase } from "../turn/actions";
import { TurnPhase } from "../turn/types";
import type { ThunkAction } from "../types";
import { executeCardEffects, getCardEffectsByTrigger } from "../utils";

/**
 * Upkeep Phase - Consolidated single handler (no subphases)
 * Triggers ON_UPKEEP effects on all installed programs.
 * This phase runs exactly once per turn after Draw and before Main.
 * This ensures effects like "Intrusive Thoughts" only trigger once per turn.
 */
export const upkeepPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    // Trigger ON_UPKEEP effects on all installed programs
    const playerPrograms = getPlayerInstalledPrograms(getState());

    playerPrograms.forEach((card) => {
      const upkeepEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_UPKEEP,
      );

      executeCardEffects(upkeepEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    // After upkeep effects, transition to Main phase
    dispatch(setTurnCurrentPhase(TurnPhase.Main));
  };
};
