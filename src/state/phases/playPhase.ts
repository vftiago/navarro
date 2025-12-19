import { CardType, Keyword, TriggerMoment } from "../../cardDefinitions/card";
import {
  addCardToPlayed,
  addToDiscard,
  addToPrograms,
  addToTrash,
  clearPlayedCards,
  getPlayerPlayedCards,
  modifyPlayerNoise,
  removeCardFromHand,
} from "../player";
import { batchDispatch } from "../store";
import {
  getTurnRemainingClicks,
  modifyClicks,
  setTurnCurrentPhase,
  TurnPhase,
} from "../turn";
import type { GameAction, ThunkAction } from "../types";
import {
  executeCardEffects,
  executeCardTriggers,
  getCardEffectsByTrigger,
  hasKeyword,
} from "../utils";

export type PlayPhasePayload = {
  cardId: string;
  handIndex: number;
};

/**
 * Play Phase - Accepts payload directly from event handler.
 * Plays card, triggers effects, and moves to appropriate zone.
 * Uses batching to minimize re-renders.
 */
export const playPhase = (payload: PlayPhasePayload): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();

    // Get the card from hand using payload data
    const card = state.playerState.playerHand[payload.handIndex];

    // Validate card exists and matches
    if (!card || card.deckContextId !== payload.cardId) {
      console.error("playPhase: Card mismatch in payload");
      return;
    }

    // Batch the initial play actions (4 actions → 1 update)
    batchDispatch([
      modifyClicks(-1),
      modifyPlayerNoise(1),
      removeCardFromHand(payload.handIndex),
      addCardToPlayed(card),
    ]);

    // Trigger ON_PLAY effects (may dispatch additional actions)
    const playerPlayedCards = getPlayerPlayedCards(getState());
    playerPlayedCards.forEach((playedCard) => {
      const playEffects = getCardEffectsByTrigger(
        playedCard,
        TriggerMoment.ON_PLAY,
      );
      executeCardEffects(playEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: playedCard.deckContextId,
      });
    });

    // Collect zone movement actions
    const zoneActions: GameAction[] = [];

    playerPlayedCards.forEach((playedCard) => {
      if (playedCard.type === CardType.PROGRAM) {
        executeCardTriggers(
          playedCard,
          TriggerMoment.ON_INSTALL,
          dispatch,
          getState,
        );
        zoneActions.push(addToPrograms(playedCard));
      } else if (hasKeyword(playedCard, Keyword.TRASH)) {
        executeCardTriggers(
          playedCard,
          TriggerMoment.ON_TRASH,
          dispatch,
          getState,
        );
        zoneActions.push(addToTrash(playedCard));
      } else {
        executeCardTriggers(
          playedCard,
          TriggerMoment.ON_DISCARD,
          dispatch,
          getState,
        );
        zoneActions.push(addToDiscard(playedCard));
      }
    });

    // Batch zone movements and cleanup
    zoneActions.push(clearPlayedCards());
    batchDispatch(zoneActions);

    // Only transition if still in Play phase (card effects may have changed it)
    if (getState().turnState.turnCurrentPhase === TurnPhase.Play) {
      dispatch(
        setTurnCurrentPhase(
          getTurnRemainingClicks(getState()) > 0
            ? TurnPhase.Main
            : TurnPhase.End,
        ),
      );
    }
  };
};
