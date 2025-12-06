import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { initialGameState, rootReducer } from "./reducer";
import type { GameAction, GameState } from "./types";

type GameStore = GameState & {
  dispatch: (action: GameAction) => void;
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...initialGameState,
      dispatch: (action: GameAction) => {
        const currentState: GameState = {
          boardState: get().boardState,
          pendingState: get().pendingState,
          playerState: get().playerState,
          serverState: get().serverState,
          settingsState: get().settingsState,
          turnState: get().turnState,
        };
        const newState = rootReducer(currentState, action);
        set(newState, undefined, action.type);
      },
    }),
    { name: "GameStore" },
  ),
);

// Helper to get GameState shape from store (for thunks and selectors)
export const getGameState = (): GameState => {
  const state = useGameStore.getState();
  return {
    boardState: state.boardState,
    pendingState: state.pendingState,
    playerState: state.playerState,
    serverState: state.serverState,
    settingsState: state.settingsState,
    turnState: state.turnState,
  };
};

/**
 * Batch dispatch multiple actions in a single Zustand update.
 * This dramatically improves performance by reducing N re-renders to 1.
 *
 * Example:
 *   batchDispatch([
 *     modifyClicks(-1),
 *     removeCardFromHand(0),
 *     setTurnCurrentPhase(TurnPhase.Play)
 *   ]);
 *
 * Instead of 3 separate Zustand updates (3 re-renders), this creates
 * a single update (1 re-render).
 */
export const batchDispatch = (actions: GameAction[]): void => {
  let state = getGameState();

  // Apply all actions sequentially to build final state
  for (const action of actions) {
    state = rootReducer(state, action);
  }

  // Single Zustand update with all changes
  useGameStore.setState(state, undefined, "BATCH_DISPATCH");
};
