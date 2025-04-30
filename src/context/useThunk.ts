import { useCallback } from "react";
import { GameAction, GameState } from "../state/types";
import { useGameState } from "./useGameState";

type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

/**
 * Hook to use thunk-like actions with our reducer context
 */
export const useThunk = () => {
  const { gameState, dispatch } = useGameState();

  const dispatchThunk = useCallback(
    (thunk: ThunkAction) => {
      thunk(dispatch, () => gameState);
    },
    [dispatch, gameState],
  );

  return dispatchThunk;
};
