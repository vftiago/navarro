import { EXIT_ANIMATION_DURATION } from "../ui/constants";
import {
  CardType,
  Keyword,
  PlayingCard,
  TriggerMoment,
} from "../cardDefinitions/card";
import {
  getCardEffectsByTrigger,
  getRandomIceCard,
  getRandomServerCard,
  hasKeyword,
} from "./utils";
import { GameAction, GameState } from "./reducer";
import {
  modifyClicks,
  setClicks,
  setTurnNextPhase,
  setTurnPhase,
  TurnPhase,
} from "./reducers/turnReducer";
import {
  addToAccessedCards,
  addToDiscard,
  addToPrograms,
  addToTrash,
  discardHand,
  drawCards,
  removeCardFromHand,
  clearAccessedCards,
  addToScoreArea,
  modifyPlayerVicotryPoints,
} from "./reducers/playerReducer";
import { addToIce, modifyServerSecurity } from "./reducers/serverReducer";
import { delay } from "framer-motion";
import {
  getPlayerCardsPerTurn,
  getPlayerClicksPerTurn,
  getTurnNextPhase,
  getTurnRemainingClicks,
} from "./selectors";

type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

export const executeDrawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerClicksPerTurn = getPlayerClicksPerTurn(getState());
    const playerCardsPerTurn = getPlayerCardsPerTurn(getState());

    dispatch(setClicks(playerClicksPerTurn));
    dispatch(drawCards(playerCardsPerTurn));
    dispatch(setTurnPhase(TurnPhase.ResolveDraw));
  };
};

export const executeResolveDrawPhase = (): ThunkAction => {
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

    dispatch(setTurnPhase(TurnPhase.Main));
  };
};

export const executePlayPhase = (
  card: PlayingCard,
  index: number,
): ThunkAction => {
  return (dispatch, getState) => {
    dispatch(modifyClicks(-1));
    dispatch(removeCardFromHand(index));

    if (card.type === CardType.PROGRAM) {
      dispatch(addToPrograms(card));
    } else if (hasKeyword(card, Keyword.TRASH)) {
      dispatch(addToTrash(card));
    } else {
      dispatch(addToDiscard(card));
    }

    const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_PLAY);

    playEffects.forEach((effect) => {
      const actions = effect.getActions({
        gameState: getState(),
        sourceId: card.deckContextId,
      });
      actions.forEach(dispatch);
    });

    dispatch(setTurnPhase(TurnPhase.ResolvePlay));
  };
};

export const executeResolvePlayPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const turnNextPhase = getTurnNextPhase(getState());

    if (turnNextPhase) {
      dispatch(setTurnPhase(turnNextPhase));
      dispatch(setTurnNextPhase(null));
    } else {
      const turnRemainingClicks = getTurnRemainingClicks(getState());

      if (turnRemainingClicks > 0) {
        dispatch(setTurnPhase(TurnPhase.Main));
      } else {
        dispatch(setTurnPhase(TurnPhase.Discard));
      }
    }
  };
};

export const executeResolveRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const turnRemainingClicks = getTurnRemainingClicks(getState());

    if (turnRemainingClicks > 0) {
      dispatch(setTurnPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnPhase(TurnPhase.Discard));
    }
  };
};

export const executeRunPhase = (): ThunkAction => {
  return (dispatch) => {
    const randomServerCard = getRandomServerCard();

    dispatch(addToAccessedCards([randomServerCard]));
    dispatch(setTurnPhase(TurnPhase.Access));
  };
};

export const executeEndRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const { playerState } = getState();

    const { playerAccessedCards } = playerState;

    playerAccessedCards.forEach((card) => {
      if (card.type === CardType.AGENDA) {
        dispatch(addToScoreArea(card));
        dispatch(modifyPlayerVicotryPoints(card.victoryPoints));
      } else {
        dispatch(addToDiscard(card));
      }
    });

    dispatch(clearAccessedCards());
    dispatch(setTurnPhase(TurnPhase.ResolveRun));
  };
};

export const executeEndPlayerTurn = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnPhase(TurnPhase.Discard));
  };
};

export const executeDiscardPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(discardHand());

    delay(() => {
      dispatch(setTurnPhase(TurnPhase.Corp));
    }, EXIT_ANIMATION_DURATION);
  };
};

export const executeCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    const randomIceCard = getRandomIceCard();

    dispatch(modifyServerSecurity(1));
    dispatch(addToIce(randomIceCard));
    dispatch(setTurnPhase(TurnPhase.End));
  };
};

export const executeStartPlayerTurn = (): ThunkAction => {
  return (dispatch, getState) => {
    const { playerState } = getState();

    const { playerClicksPerTurn } = playerState;

    dispatch(setClicks(playerClicksPerTurn));
    dispatch(setTurnPhase(TurnPhase.Draw));
  };
};

export const onCloseDisplayCardModal = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();

    const { turnNextPhase } = state.turnState;

    setTimeout(() => {
      if (turnNextPhase) {
        dispatch(setTurnPhase(turnNextPhase));
      }
    }, EXIT_ANIMATION_DURATION);
  };
};
