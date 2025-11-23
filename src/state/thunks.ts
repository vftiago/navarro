import {
  CardType,
  Keyword,
  PlayingCard,
  TriggerMoment,
} from "../cardDefinitions/card";
import { GameAction, GameState } from "./reducer";
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
  addCardToPlayed,
  clearPlayedCards,
} from "./reducers/playerReducer";
import {
  addToIce,
  modifyServerSecurity,
  removeFromUnencounteredIce,
} from "./reducers/serverReducer";
import {
  modifyClicks,
  setClicks,
  setTurnNextPhase,
  setTurnCurrentPhase,
  TurnPhase,
  setTurnCurrentSubPhase,
  TurnSubPhase,
} from "./reducers/turnReducer";
import {
  getPlayerCardsPerTurn,
  getPlayerClicksPerTurn,
  getPlayerPlayedCards,
  getServerUnencounteredIce,
  getTurnNextPhase,
  getTurnRemainingClicks,
} from "./selectors";
import {
  getCardEffectsByTrigger,
  getRandomIceCard,
  getRandomServerCard,
  hasKeyword,
} from "./utils";

type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

// #region draw phase
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
// #endregion draw phase

// the card should be added to the playerPlayedCards during the main process phase.
// the main porcess phase would then trigger the main end phase, which in turn would trigger the play phase.

// #region play phase
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
// #endregion play phase

// #region run phase
export const startRunPhase = (): ThunkAction => {
  return (dispatch) => {
    const randomServerCard = getRandomServerCard();

    dispatch(addToAccessedCards([randomServerCard]));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processRunPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const serverUnencounteredIce = getServerUnencounteredIce(gameState);

    if (serverUnencounteredIce.length > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Encounter));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.Access));
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endRunPhase = (): ThunkAction => {
  // this needs to be moved to the access phase
  return (dispatch, getState) => {
    const { playerState } = getState();

    const { playerAccessedCards } = playerState;

    playerAccessedCards.forEach((card) => {
      const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_FETCH);

      playEffects.forEach((effect) => {
        const actions = effect.getActions({
          gameState: getState(),
          sourceId: card.deckContextId,
        });
        actions.forEach(dispatch);
      });

      if (card.type === CardType.AGENDA) {
        dispatch(addToScoreArea(card));
      } else {
        dispatch(addToDiscard(card));
      }
    });

    dispatch(clearAccessedCards());

    const turnRemainingClicks = getTurnRemainingClicks(getState());

    if (turnRemainingClicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
// #endregion run phase

// #region encounter phase
export const startEncounterPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Encounter));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processEncounterPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();
    const serverUnencounteredIce = getServerUnencounteredIce(gameState);
    const firstUnencounteredIce = serverUnencounteredIce[0];

    const playEffects = getCardEffectsByTrigger(
      firstUnencounteredIce,
      TriggerMoment.ON_ENCOUNTER,
    );

    const actions = playEffects.flatMap((effect) =>
      effect.getActions({
        gameState,
        sourceId: firstUnencounteredIce.deckContextId,
      }),
    );

    actions.forEach(dispatch);

    dispatch(removeFromUnencounteredIce(firstUnencounteredIce));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};
export const endEncounterPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Run));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};

// #region end phase
export const startEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.End));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(discardHand());
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Corp));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};

export const startCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processCorpPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();

    dispatch(modifyServerSecurity(1));

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

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endCorpPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Draw));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
