// Event types for game actions
export enum GameEventType {
  // Player actions
  CARD_ACTIVATE_ABILITY = "CARD_ACTIVATE_ABILITY",
  PLAYER_CLICK_ICE = "PLAYER_CLICK_ICE",
  PLAYER_END_TURN = "PLAYER_END_TURN",
  PLAYER_INITIATE_RUN = "PLAYER_INITIATE_RUN",
  PLAYER_PLAY_CARD = "PLAYER_PLAY_CARD",
  PLAYER_SELECT_ACCESSED_CARD = "PLAYER_SELECT_ACCESSED_CARD",
}

// Event payloads (discriminated union type)
export type GameEvent =
  | {
      payload: { cardId: string; handIndex: number };
      type: GameEventType.PLAYER_PLAY_CARD;
    }
  | { payload: Record<string, never>; type: GameEventType.PLAYER_INITIATE_RUN }
  | { payload: { iceId: string }; type: GameEventType.PLAYER_CLICK_ICE }
  | {
      payload: { cardId: string };
      type: GameEventType.PLAYER_SELECT_ACCESSED_CARD;
    }
  | { payload: Record<string, never>; type: GameEventType.PLAYER_END_TURN }
  | {
      payload: { abilityIndex: number; cardId: string };
      type: GameEventType.CARD_ACTIVATE_ABILITY;
    };

// Event bus type
export type EventBus = {
  emit: (event: GameEvent) => void;
  getHistory: () => GameEvent[];
  subscribe: (listener: (event: GameEvent) => void) => () => void;
};

/**
 * Creates an event bus for game actions.
 * Provides event emission, subscription, and history tracking.
 */
export const createEventBus = (): EventBus => {
  const listeners: ((event: GameEvent) => void)[] = [];
  const history: GameEvent[] = [];

  return {
    emit: (event: GameEvent) => {
      // Log event for debugging in development
      if (import.meta.env.DEV) {
        console.log("[GameEvent]", event.type, event.payload);
      }

      // Add to history
      history.push(event);

      // Notify all listeners
      listeners.forEach((listener) => listener(event));
    },

    getHistory: () => [...history],

    subscribe: (listener: (event: GameEvent) => void) => {
      listeners.push(listener);
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },
  };
};
