import { discardHand } from "../player";
import { setTurnCurrentPhase, TurnPhase } from "../turn";
import type { ThunkAction } from "../types";

/**
 * End Phase - Consolidated single handler (no subphases)
 * Executes at the end of the player's turn.
 */
export const endPhase = (): ThunkAction => {
  return (dispatch) => {
    // Discard entire hand
    dispatch(discardHand());

    // Transition to Corp phase (next turn begins)
    dispatch(setTurnCurrentPhase(TurnPhase.Corp));
  };
};
