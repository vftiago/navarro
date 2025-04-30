import {
  addToPrograms,
  modifyClicks,
  addToTrash,
  addToDiscard,
  removeCardFromHand,
  discardHand,
  setClicks,
  drawCards,
  setPhase,
} from "./actions";
import { GameAction, GamePhase, GameState } from "./types";
import { EXIT_ANIMATION_DURATION } from "../ui/constants";
import { CardType, Keyword, PlayingCardT } from "../cards/card";
import { hasKeyword } from "./utils/cardUtils";
import { getPlayerCardsPerTurn, getPlayerClicksPerTurn } from "./selectors";

type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

export const executeDrawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();

    const playerClicksPerTurn = getPlayerClicksPerTurn(state);

    dispatch(setClicks(playerClicksPerTurn));

    dispatch(setPhase(GamePhase.Draw));

    const playerCardsPerTurn = getPlayerCardsPerTurn(state);

    dispatch(drawCards(playerCardsPerTurn));

    setTimeout(() => {
      dispatch(setPhase(GamePhase.Main));
    }, EXIT_ANIMATION_DURATION);
  };
};

export const executePlayPhase = (
  card: PlayingCardT,
  index: number,
): ThunkAction => {
  return (dispatch) => {
    dispatch(setPhase(GamePhase.Play));

    dispatch(modifyClicks(-1));

    if (card.type === CardType.PROGRAM) {
      dispatch(addToPrograms(card));
    } else if (hasKeyword(card, Keyword.TRASH)) {
      dispatch(addToTrash(card));
    } else {
      dispatch(addToDiscard(card));
    }

    dispatch(removeCardFromHand(index));
  };
};

export const accessServer = (cardCount: number = 1): ThunkAction => {
  return (dispatch) => {
    dispatch(accessPhase(cardCount));
  };
};

export const executeDiscardPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(discardPhase());

    dispatch(discardHand());

    setTimeout(() => {
      dispatch(corpPhase());
    }, EXIT_ANIMATION_DURATION);
  };
};

export const executeCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(corpPhase());

    setTimeout(() => {
      dispatch(drawPhase());
    }, EXIT_ANIMATION_DURATION);
  };
};

export const onCloseDisplayCardModal = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const { turnNextAction } = state.turnState;

    setTimeout(() => {
      if (turnNextAction) {
        dispatch(turnNextAction);
      }
    }, EXIT_ANIMATION_DURATION);
  };
};
