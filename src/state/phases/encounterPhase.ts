import { TriggerMoment } from "../../cardDefinitions/card";
import {
  getServerUnencounteredIce,
  removeFromUnencounteredIce,
  setCurrentEncounteredIce,
} from "../server";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import { ThunkAction } from "../types";
import { getCardEffectsByTrigger } from "../utils";

export const startEncounterPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const serverUnencounteredIce = getServerUnencounteredIce(gameState);

    if (serverUnencounteredIce.length > 0) {
      // Set the first unencountered ice as the current encountered ice
      const firstUnencounteredIce = serverUnencounteredIce[0];
      dispatch(setCurrentEncounteredIce(firstUnencounteredIce));
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processEncounterPhase = (): ThunkAction => {
  return (dispatch) => {
    // Wait for player to click the encountered ice
    // This will be handled by the UI click handler
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const triggerEncounterEffects = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const currentEncounteredIce =
      gameState.serverState.serverCurrentEncounteredIce;

    if (currentEncounteredIce) {
      // Trigger ON_ENCOUNTER effects
      const playEffects = getCardEffectsByTrigger(
        currentEncounteredIce,
        TriggerMoment.ON_ENCOUNTER,
      );

      const actions = playEffects.flatMap((effect) =>
        effect.getActions({
          gameState,
          sourceId: currentEncounteredIce.deckContextId,
        }),
      );

      actions.forEach(dispatch);
    }
  };
};

export const endEncounterPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const currentEncounteredIce =
      gameState.serverState.serverCurrentEncounteredIce;

    if (currentEncounteredIce) {
      // Remove the encountered ice from unencountered list
      dispatch(removeFromUnencounteredIce(currentEncounteredIce));
      dispatch(setCurrentEncounteredIce(null));
    }

    // Check if there are more ice to encounter
    const serverUnencounteredIce = getServerUnencounteredIce(getState());

    if (serverUnencounteredIce.length > 0) {
      // Loop back to encounter the next ice
      dispatch(setTurnCurrentPhase(TurnPhase.Encounter));
      dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
    } else {
      // No more ice, go to access phase
      dispatch(setTurnCurrentPhase(TurnPhase.Access));
      dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
    }
  };
};
