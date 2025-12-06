import type { PlayingCard } from "../../cardDefinitions/card";
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
  executeCardTriggers,
  getCardEffectsByTrigger,
  getRandomServerCard,
} from "../utils";

export const startAccessPhase = (): ThunkAction => {
  return (dispatch) => {
    const randomServerCards = [
      getRandomServerCard(),
      getRandomServerCard(),
      getRandomServerCard(),
    ];

    dispatch(addToAccessedCards(randomServerCards));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processAccessPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const { playerState } = getState();

    // Trigger ON_ACCESS effects for all accessed cards when they're revealed
    playerState.playerAccessedCards.forEach((card) => {
      const accessEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_ACCESS,
      );
      executeCardEffects(accessEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const selectAccessedCard = (card: PlayingCard): ThunkAction => {
  return (dispatch, getState) => {
    // Trigger ON_FETCH effects for the selected card
    const fetchEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_FETCH);
    executeCardEffects(fetchEffects, dispatch, getState, {
      gameState: getState(),
      sourceId: card.deckContextId,
    });

    // Move card to appropriate zone
    if (card.type === CardType.AGENDA) {
      dispatch(addToScoreArea(card));
    } else {
      executeCardTriggers(card, TriggerMoment.ON_DISCARD, dispatch, getState);
      dispatch(addToDiscard(card));
    }

    // Clear all accessed cards (removes the other two cards)
    dispatch(clearAccessedCards());
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
    });
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
