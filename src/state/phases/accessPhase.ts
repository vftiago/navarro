import { CardType, TriggerMoment } from "../../cardDefinitions/card";
import {
  addToAccessedCards,
  addToDiscard,
  addToScoreArea,
  clearAccessedCards,
} from "../player";
import {
  getTurnRemainingClicks,
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  getCardEffectsByTrigger,
  getRandomServerCard,
} from "../utils";

export const startAccessPhase = (): ThunkAction => {
  return (dispatch) => {
    // Get a random server card when access phase starts
    const randomServerCard = getRandomServerCard();
    dispatch(addToAccessedCards([randomServerCard]));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processAccessPhase = (): ThunkAction => {
  return (dispatch) => {
    // Wait for player to click the accessed card or dismiss the modal
    // This will be handled by the UI click handler
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const finalizeAccessedCards = (): ThunkAction => {
  return (dispatch, getState) => {
    const { playerState } = getState();
    const { playerAccessedCards } = playerState;

    // Trigger ON_FETCH effects for accessed cards
    playerAccessedCards.forEach((card) => {
      const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_FETCH);

      executeCardEffects(playEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });

      // Move cards to appropriate zones
      if (card.type === CardType.AGENDA) {
        dispatch(addToScoreArea(card));
      } else {
        dispatch(addToDiscard(card));
      }
    });

    dispatch(clearAccessedCards());
  };
};

export const endAccessPhase = (): ThunkAction => {
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
