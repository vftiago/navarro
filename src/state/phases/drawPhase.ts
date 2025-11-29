import { TriggerMoment } from "../../cardDefinitions/card";
import {
  drawCards,
  getPlayerCardsPerTurn,
  getPlayerClicksPerTurn,
} from "../player";
import {
  getTurnRemainingClicks,
  setClicks,
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import { ThunkAction } from "../types";
import { getCardEffectsByTrigger } from "../utils";

export const startDrawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerClicksPerTurn = getPlayerClicksPerTurn(getState());
    const playerCardsPerTurn = getPlayerCardsPerTurn(getState());

    dispatch(setClicks(playerClicksPerTurn));
    dispatch(drawCards(playerCardsPerTurn));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processDrawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const { playerState } = getState();
    const { playerHand } = playerState;

    playerHand.forEach((card) => {
      const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_DRAW);

      playEffects.forEach((effect) => {
        const actions = effect.getActions({
          gameState: getState(),
          sourceId: card.deckContextId,
        });
        actions.forEach(dispatch);
      });
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endDrawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const turnRemainingClicks = getTurnRemainingClicks(getState());

    if (turnRemainingClicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
