// Event types for game actions
//
// The vocabulary is deliberately minimal: a card click is a single generic
// event — the event handler resolves what it means from where the card lives
// and the current phase/run state. Named intents exist only for actions that
// are not card clicks (buttons). Add a more specific event only when one
// click could mean two different things (e.g. future ability menus).
export enum GameEventType {
  CARD_CLICKED = "CARD_CLICKED",
  PLAYER_END_TURN = "PLAYER_END_TURN",
  PLAYER_INITIATE_RUN = "PLAYER_INITIATE_RUN",
}

// Event payloads (discriminated union type)
export type GameEvent =
  | { payload: Record<string, never>; type: GameEventType.PLAYER_END_TURN }
  | { payload: Record<string, never>; type: GameEventType.PLAYER_INITIATE_RUN }
  | { payload: { instanceId: string }; type: GameEventType.CARD_CLICKED };

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
