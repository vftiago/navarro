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
  TurnPhase,
} from "../turn";
import type { ThunkAction } from "../types";
import { executeCardEffects, getCardEffectsByTrigger } from "../utils";

/**
 * Draw Phase - Consolidated single handler (no subphases)
 * Resets clicks, draws cards, and triggers ON_DRAW effects.
 */
export const drawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    // Reset clicks to clicks per turn
    const playerClicksPerTurn = getPlayerClicksPerTurn(getState());
    dispatch(setClicks(playerClicksPerTurn));

    // Draw cards for turn
    const playerCardsPerTurn = getPlayerCardsPerTurn(getState());
    dispatch(drawCards(playerCardsPerTurn));

    // Trigger ON_DRAW effects on all cards in hand
    const { playerHand } = getState().playerState;
    playerHand.forEach((card) => {
      const drawEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_DRAW);
      executeCardEffects(drawEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    // Transition to Upkeep or End based on remaining clicks
    const turnRemainingClicks = getTurnRemainingClicks(getState());
    if (turnRemainingClicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Upkeep));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }
  };
};
