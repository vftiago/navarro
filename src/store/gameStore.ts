import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  GameAction,
  GameState,
  initialGameState,
  rootReducer,
} from "../state/reducer";

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
    playerState: state.playerState,
    serverState: state.serverState,
    settingsState: state.settingsState,
    turnState: state.turnState,
  };
};
