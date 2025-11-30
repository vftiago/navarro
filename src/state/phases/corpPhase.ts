import { TriggerMoment } from "../../cardDefinitions/card";
import { addToIce, modifyServerSecurity } from "../server";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  getCardEffectsByTrigger,
  getRandomIceCard,
} from "../utils";

export const startCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processCorpPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();

    dispatch(modifyServerSecurity(1));

    const { serverInstalledIce, serverMaxIceSlots } = gameState.serverState;

    if (serverInstalledIce.length < serverMaxIceSlots) {
      const randomIceCard = getRandomIceCard();

      dispatch(addToIce(randomIceCard));

      const rezEffects = getCardEffectsByTrigger(
        randomIceCard,
        TriggerMoment.ON_REZ,
      );

      executeCardEffects(rezEffects, dispatch, getState, {
        gameState,
        sourceId: randomIceCard.deckContextId,
      });
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Draw));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
