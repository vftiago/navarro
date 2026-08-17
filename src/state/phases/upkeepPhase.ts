import { executeTriggers } from "../../cards/engine";
import { TriggerMoment } from "../../cards/enums";
import { getPlayerInstalledPrograms } from "../player";
import { setTurnCurrentPhase } from "../turn/actions";
import { TurnPhase } from "../turn/types";
import type { ThunkAction } from "../types";

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
      executeTriggers(card, TriggerMoment.ON_UPKEEP, dispatch, getState);
    });

    // After upkeep effects, transition to Main phase
    dispatch(setTurnCurrentPhase(TurnPhase.Main));
  };
};
