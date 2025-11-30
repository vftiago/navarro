import { addToUnencounteredIce, getServerUnencounteredIce } from "../server";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import type { ThunkAction } from "../types";

export const startRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    // Initialize unencountered ice with all installed ice (innermost to outermost)
    const gameState = getState();
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
  return (dispatch) => {
    // Run phase just transitions to the next phase determined in process
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
