import { TriggerMoment } from "../../cardDefinitions/card";
import { addToDiscard, removeCardFromHand } from "../player";
import type { ThunkAction } from "../types";
import { executeCardTriggers } from "./cardUtils";

/**
 * Deals net damage to the player by discarding random cards from hand
 * @param count - Number of cards to discard
 */
export const dealNetDamage = (count: number): ThunkAction => {
  return (dispatch, getState) => {
    for (let i = 0; i < count; i++) {
      const state = getState();
      const playerHand = state.playerState.playerHand;

      if (playerHand.length === 0) {
        break;
      }

      const randomIndex = Math.floor(Math.random() * playerHand.length);
      const cardToDiscard = playerHand[randomIndex];

      dispatch(removeCardFromHand(randomIndex));

      executeCardTriggers(
        cardToDiscard,
        TriggerMoment.ON_DISCARD,
        dispatch,
        getState,
      );

      dispatch(addToDiscard(cardToDiscard));
    }
  };
};
