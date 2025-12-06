import { clearPendingAction, setPendingAction } from "../pending";
import { batchDispatch } from "../store";
import {
  incrementPhaseCounter,
  RunProgressState,
  setTurnCurrentPhase,
  TurnPhase,
} from "../turn";
import type { GameAction, GameState } from "../types";
import type { GameEvent } from "./eventBus";
import { GameEventType } from "./eventBus";

/**
 * Creates an event handler that translates game events into state updates.
 * This is the bridge between the event bus and the game state.
 *
 * Pattern:
 * 1. Validate the event is legal in current game state
 * 2. Store runtime data in pending state (if needed)
 * 3. Transition to appropriate phase/subphase
 * 4. PhaseManager will detect change and execute phase handlers
 */
export const createEventHandler = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => {
  return (event: GameEvent) => {
    const state = getState();

    switch (event.type) {
      case GameEventType.PLAYER_PLAY_CARD: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot play card outside Main phase");
          return;
        }

        // Validate: Card must exist in hand
        const card = state.playerState.playerHand[event.payload.handIndex];
        if (!card || card.deckContextId !== event.payload.cardId) {
          console.error("Card not found in hand at specified index");
          return;
        }

        // Batch pending action + phase transition (2 actions → 1 update)
        batchDispatch([
          setPendingAction({
            cardId: event.payload.cardId,
            handIndex: event.payload.handIndex,
            type: "PLAY_CARD",
          }),
          setTurnCurrentPhase(TurnPhase.Play),
        ]);
        break;
      }

      case GameEventType.PLAYER_INITIATE_RUN: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot initiate run outside Main phase");
          return;
        }

        // Validate: Must have clicks remaining
        if (state.turnState.turnRemainingClicks <= 0) {
          console.warn("Cannot initiate run without clicks");
          return;
        }

        // Batch pending action + phase transition (2 actions → 1 update)
        batchDispatch([
          setPendingAction({ type: "INITIATE_RUN" }),
          setTurnCurrentPhase(TurnPhase.Run),
        ]);
        break;
      }

      case GameEventType.PLAYER_CLICK_ICE: {
        // Validate: Must be in Run phase with ENCOUNTERING_ICE state
        if (
          state.turnState.turnCurrentPhase !== TurnPhase.Run ||
          state.turnState.runProgressState !== RunProgressState.ENCOUNTERING_ICE
        ) {
          console.warn("Cannot click ice outside run encounter state");
          return;
        }

        // Validate: Ice must be the current encountered ice
        if (
          !state.serverState.serverCurrentEncounteredIce ||
          state.serverState.serverCurrentEncounteredIce.deckContextId !==
            event.payload.iceId
        ) {
          console.warn("Can only click currently encountered ice");
          return;
        }

        // Store pending action with ice ID
        dispatch(
          setPendingAction({
            iceId: event.payload.iceId,
            type: "CLICK_ICE",
          }),
        );

        // Increment phase counter to trigger PhaseManager to re-run runPhase
        dispatch(incrementPhaseCounter());
        break;
      }

      case GameEventType.PLAYER_SELECT_ACCESSED_CARD: {
        // Validate: Must be in Run phase with ACCESSING_CARDS state
        if (
          state.turnState.turnCurrentPhase !== TurnPhase.Run ||
          state.turnState.runProgressState !== RunProgressState.ACCESSING_CARDS
        ) {
          console.warn("Cannot select card outside run access state");
          return;
        }

        // Validate: Card must be in accessed cards
        const accessedCard = state.playerState.playerAccessedCards.find(
          (card) => card.deckContextId === event.payload.cardId,
        );

        if (!accessedCard) {
          console.error("Card not found in accessed cards");
          return;
        }

        // Store pending action with selected card ID
        dispatch(
          setPendingAction({
            cardId: event.payload.cardId,
            type: "SELECT_ACCESSED_CARD",
          }),
        );

        // Increment phase counter to trigger PhaseManager to re-run runPhase
        dispatch(incrementPhaseCounter());
        break;
      }

      case GameEventType.PLAYER_END_TURN: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot end turn outside Main phase");
          return;
        }

        // Clear any pending actions
        dispatch(clearPendingAction());

        // Transition to End phase
        dispatch(setTurnCurrentPhase(TurnPhase.End));
        break;
      }

      case GameEventType.CARD_ACTIVATE_ABILITY: {
        // TODO: Implement card ability activation
        // This will be used for cards with ON_CLICK effects
        console.warn(
          "CARD_ACTIVATE_ABILITY not yet implemented:",
          event.payload,
        );
        break;
      }

      default: {
        // TypeScript exhaustiveness check
        const _exhaustiveCheck: never = event;
        console.warn("Unhandled event type:", _exhaustiveCheck);
      }
    }
  };
};
