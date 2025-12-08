import {
  clickIce,
  initiateRun,
  playPhase,
  selectAccessedCard,
} from "../phases";
import { RunProgressState, setTurnCurrentPhase, TurnPhase } from "../turn";
import type { GameAction, GameState } from "../types";
import type { GameEvent } from "./eventBus";
import { GameEventType } from "./eventBus";

/**
 * Creates an event handler that translates game events into state updates.
 * This is the bridge between the event bus and the game state.
 *
 * Pattern:
 * 1. Validate the event is legal in current game state
 * 2. Invoke phase thunk directly with payload (no pending state)
 * 3. Phase logic executes and handles all state transitions
 */
export const createEventHandler = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => {
  // Helper to dispatch thunks with payload
  const dispatchThunk = <T>(
    thunkCreator: (
      payload: T,
    ) => (
      dispatch: (action: GameAction) => void,
      getState: () => GameState,
    ) => void,
    payload: T,
  ) => {
    thunkCreator(payload)(dispatch, getState);
  };

  // Helper to dispatch thunks without payload
  const dispatchThunkNoPayload = (
    thunkCreator: () => (
      dispatch: (action: GameAction) => void,
      getState: () => GameState,
    ) => void,
  ) => {
    thunkCreator()(dispatch, getState);
  };

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

        // Transition to Play phase and execute phase logic directly
        dispatch(setTurnCurrentPhase(TurnPhase.Play));
        dispatchThunk(playPhase, {
          cardId: event.payload.cardId,
          handIndex: event.payload.handIndex,
        });
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

        // initiateRun sets the phase to Run internally
        dispatchThunkNoPayload(initiateRun);
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

        // Execute ice click logic directly
        dispatchThunk(clickIce, { iceId: event.payload.iceId });
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

        // Execute card selection logic directly
        dispatchThunk(selectAccessedCard, { cardId: event.payload.cardId });
        break;
      }

      case GameEventType.PLAYER_END_TURN: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot end turn outside Main phase");
          return;
        }

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
