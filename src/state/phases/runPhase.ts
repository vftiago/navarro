import { TriggerMoment } from "../../cardDefinitions/card";
import { getPlayerInstalledPrograms } from "../player";
import { addToUnencounteredIce, getServerUnencounteredIce } from "../server";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import type { ThunkAction } from "../types";
import { executeCardEffects, getCardEffectsByTrigger } from "../utils";

export const startRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const playerPrograms = getPlayerInstalledPrograms(gameState);

    playerPrograms.forEach((card) => {
      const runStartEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_RUN_START,
      );

      executeCardEffects(runStartEffects, dispatch, getState, {
        gameState,
        sourceId: card.deckContextId,
      });
    });

    // Initialize unencountered ice with all installed ice (innermost to outermost)
    const serverInstalledIce = gameState.serverState.serverInstalledIce;

    // Add all installed ice to unencountered ice array in reverse order (innermost first)
    [...serverInstalledIce].reverse().forEach((ice) => {
      dispatch(addToUnencounteredIce(ice));
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const serverUnencounteredIce = getServerUnencounteredIce(gameState);

    if (serverUnencounteredIce.length > 0) {
      // There are ice to encounter, start encounter phase
      dispatch(setTurnCurrentPhase(TurnPhase.Encounter));
      dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
    } else {
      // No ice to encounter, go straight to access phase
      dispatch(setTurnCurrentPhase(TurnPhase.Access));
      dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
    }
  };
};

export const endRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const playerPrograms = getPlayerInstalledPrograms(gameState);

    playerPrograms.forEach((card) => {
      const runEndEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_RUN_END,
      );

      executeCardEffects(runEndEffects, dispatch, getState, {
        gameState,
        sourceId: card.deckContextId,
      });
    });

    // Run phase just transitions to the next phase determined in process
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
