import { CardType, Keyword, TriggerMoment } from "../../cardDefinitions/card";
import { clearPendingAction, getPendingAction } from "../pending";
import {
  addCardToPlayed,
  addToDiscard,
  addToPrograms,
  addToTrash,
  clearPlayedCards,
  getPlayerPlayedCards,
  removeCardFromHand,
} from "../player";
import { batchDispatch } from "../store";
import {
  getTurnNextPhase,
  getTurnRemainingClicks,
  modifyClicks,
  setTurnCurrentPhase,
  setTurnNextPhase,
  TurnPhase,
} from "../turn";
import type { GameAction, ThunkAction } from "../types";
import {
  executeCardEffects,
  executeCardTriggers,
  getCardEffectsByTrigger,
  hasKeyword,
} from "../utils";

/**
 * Play Phase - Consolidated single handler (no subphases)
 * Reads card from pending state, plays it, triggers effects, and moves to appropriate zone.
 * Uses batching to minimize re-renders.
 */
export const playPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const pendingAction = getPendingAction(state);

    // Validate pending action exists and is correct type
    if (!pendingAction || pendingAction.type !== "PLAY_CARD") {
      console.error("playPhase: No pending PLAY_CARD action found");
      return;
    }

    // Get the card from hand using pending action data
    const card = state.playerState.playerHand[pendingAction.handIndex];

    // Validate card exists and matches
    if (!card || card.deckContextId !== pendingAction.cardId) {
      console.error("playPhase: Card mismatch in pending action");
      return;
    }

    // Batch the initial play actions (4 actions → 1 update)
    batchDispatch([
      modifyClicks(-1),
      removeCardFromHand(pendingAction.handIndex),
      addCardToPlayed(card),
      clearPendingAction(),
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

    // Determine next phase
    const turnNextPhase = getTurnNextPhase(getState());

    if (turnNextPhase) {
      // Card set a specific next phase (e.g., Run card → Run phase)
      batchDispatch([
        setTurnCurrentPhase(turnNextPhase),
        setTurnNextPhase(null),
      ]);
    } else {
      // Return to Main or End based on clicks
      const turnRemainingClicks = getTurnRemainingClicks(getState());
      if (turnRemainingClicks > 0) {
        dispatch(setTurnCurrentPhase(TurnPhase.Main));
      } else {
        dispatch(setTurnCurrentPhase(TurnPhase.End));
      }
    }
  };
};
