import { useCallback } from "react";
import { useGameState } from "./useGameState";
import { GameAction, GameState } from "../state/reducer";

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

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
