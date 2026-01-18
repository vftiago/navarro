import { TriggerMoment } from "../../cardDefinitions/card";
import { addToIce, modifyServerSecurity, ServerName } from "../server";
import { setTurnCurrentPhase, TurnPhase } from "../turn";
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  getCardEffectsByTrigger,
  getRandomIceCard,
} from "../utils";

const ALL_SERVERS = [ServerName.HQ, ServerName.RD, ServerName.ARCHIVES];

/**
 * Corp Phase - Consolidated single handler (no subphases)
 * Executes at the beginning of each turn (before player's Draw phase).
 */
export const corpPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const gameState = getState();

    // Increase server security level
    dispatch(modifyServerSecurity(1));

    // Find servers with available slots
    const { serverMaxIceSlots, servers } = gameState.serverState;
    const serversWithSlots = ALL_SERVERS.filter(
      (server) => servers[server].installedIce.length < serverMaxIceSlots,
    );

    // Install random ice to a random server if any have slots available
    if (serversWithSlots.length > 0) {
      const randomServer =
        serversWithSlots[Math.floor(Math.random() * serversWithSlots.length)];
      const randomIceCard = getRandomIceCard();

      dispatch(addToIce(randomIceCard, randomServer));

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
