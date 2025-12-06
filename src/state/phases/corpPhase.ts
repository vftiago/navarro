import { TriggerMoment } from "../../cardDefinitions/card";
import { addToIce, modifyServerSecurity } from "../server";
import { setTurnCurrentPhase, TurnPhase } from "../turn";
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  getCardEffectsByTrigger,
  getRandomIceCard,
} from "../utils";

/**
 * Corp Phase - Consolidated single handler (no subphases)
 * Executes at the beginning of each turn (before player's Draw phase).
 */
export const corpPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();

    // Increase server security level
    dispatch(modifyServerSecurity(1));

    // Install random ice if slots available
    const { serverInstalledIce, serverMaxIceSlots } = gameState.serverState;

    if (serverInstalledIce.length < serverMaxIceSlots) {
      const randomIceCard = getRandomIceCard();

      dispatch(addToIce(randomIceCard));

      // Trigger ON_REZ effects on newly installed ice
      const rezEffects = getCardEffectsByTrigger(
        randomIceCard,
        TriggerMoment.ON_REZ,
      );

      executeCardEffects(rezEffects, dispatch, getState, {
        gameState,
        sourceId: randomIceCard.deckContextId,
      });
    }

    // Transition to Draw phase
    dispatch(setTurnCurrentPhase(TurnPhase.Draw));
  };
};
