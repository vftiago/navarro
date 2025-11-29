import { TriggerMoment } from "../../cardDefinitions/card";
import { addToIce, modifyServerSecurity } from "../server";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import { ThunkAction } from "../types";
import { getCardEffectsByTrigger, getRandomIceCard } from "../utils";

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

      const actions = rezEffects.flatMap((effect) =>
        effect.getActions({
          gameState,
          sourceId: randomIceCard.deckContextId,
        }),
      );

      actions.forEach(dispatch);
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
