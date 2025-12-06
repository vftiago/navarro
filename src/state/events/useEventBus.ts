import { createContext, useContext } from "react";
import type { EventBus } from "./eventBus";

/**
 * React context for the event bus.
 * Provides access to the event bus throughout the component tree.
 */
export const EventBusContext = createContext<EventBus | null>(null);

/**
 * Hook to access the event bus from any component.
 * Throws an error if used outside of EventBusContext.Provider.
 *
 * @example
 * const eventBus = useEventBus();
 * eventBus.emit({ type: GameEventType.PLAYER_PLAY_CARD, payload: { ... } });
 */
export const useEventBus = (): EventBus => {
  const eventBus = useContext(EventBusContext);

  if (!eventBus) {
    throw new Error(
      "useEventBus must be used within an EventBusContext.Provider",
    );
  }

  return eventBus;
};
