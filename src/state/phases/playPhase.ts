import {
  CardType,
  Keyword,
  type PlayingCard,
  TriggerMoment,
} from "../../cardDefinitions/card";
import {
  addCardToPlayed,
  addToDiscard,
  addToPrograms,
  addToTrash,
  clearPlayedCards,
  getPlayerPlayedCards,
  removeCardFromHand,
} from "../player";
import {
  getTurnNextPhase,
  getTurnRemainingClicks,
  modifyClicks,
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  setTurnNextPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  getCardEffectsByTrigger,
  hasKeyword,
} from "../utils";

export const startPlayPhase = (
  card: PlayingCard,
  index: number,
): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Play));
    dispatch(modifyClicks(-1));
    dispatch(removeCardFromHand(index));
    dispatch(addCardToPlayed(card));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processPlayPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerPlayedCards = getPlayerPlayedCards(getState());

    playerPlayedCards.forEach((card) => {
      const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_PLAY);

      executeCardEffects(playEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endPlayPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerPlayedCards = getPlayerPlayedCards(getState());

    playerPlayedCards.forEach((card) => {
      if (card.type === CardType.PROGRAM) {
        dispatch(addToPrograms(card));
      } else if (hasKeyword(card, Keyword.TRASH)) {
        dispatch(addToTrash(card));
      } else {
        dispatch(addToDiscard(card));
      }
    });

    dispatch(clearPlayedCards());

    const turnNextPhase = getTurnNextPhase(getState());

    if (turnNextPhase) {
      dispatch(setTurnCurrentPhase(turnNextPhase));
      dispatch(setTurnNextPhase(null));
    } else {
      const turnRemainingClicks = getTurnRemainingClicks(getState());

      if (turnRemainingClicks > 0) {
        dispatch(setTurnCurrentPhase(TurnPhase.Main));
      } else {
        dispatch(setTurnCurrentPhase(TurnPhase.End));
      }
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
