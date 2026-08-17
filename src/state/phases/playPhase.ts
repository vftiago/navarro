import { executeTriggers, hasKeywordFlag } from "../../cards/engine";
import { CardType, TriggerMoment } from "../../cards/enums";
import { resolveCard } from "../../cards/instance";
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

export type PlayPhasePayload = {
  cardId: string;
};

/**
 * Play Phase - Accepts payload directly from event handler.
 * Plays card, triggers effects, and moves to appropriate zone.
 * Uses batching to minimize re-renders.
 */
export const playPhase = (payload: PlayPhasePayload): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();

    // Locate the card in hand
    const handIndex = state.playerState.playerHand.findIndex(
      (handCard) => handCard.instanceId === payload.cardId,
    );

    if (handIndex === -1) {
      console.error("playPhase: Card not found in hand");

      return;
    }

    const card = state.playerState.playerHand[handIndex];

    // Batch the initial play actions
    const playActions: GameAction[] = [
      modifyClicks(-1),
      removeCardFromHand(handIndex),
      addCardToPlayed(card),
    ];

    if (!hasKeywordFlag(resolveCard(card).keywords, "noNoiseOnPlay")) {
      playActions.push(modifyPlayerNoise(1));
    }

    batchDispatch(playActions);

    // Trigger ON_PLAY effects (may dispatch additional actions)
    const playerPlayedCards = getPlayerPlayedCards(getState());
    playerPlayedCards.forEach((playedCard) => {
      executeTriggers(playedCard, TriggerMoment.ON_PLAY, dispatch, getState);
    });

    // Collect zone movement actions
    const zoneActions: GameAction[] = [];

    playerPlayedCards.forEach((playedCard) => {
      const definition = resolveCard(playedCard);
      if (definition.type === CardType.PROGRAM) {
        executeTriggers(
          playedCard,
          TriggerMoment.ON_INSTALL,
          dispatch,
          getState,
        );
        zoneActions.push(addToPrograms(playedCard));
      } else if (hasKeywordFlag(definition.keywords, "trashAfterPlay")) {
        executeTriggers(playedCard, TriggerMoment.ON_TRASH, dispatch, getState);
        zoneActions.push(addToTrash(playedCard));
      } else {
        executeTriggers(
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
