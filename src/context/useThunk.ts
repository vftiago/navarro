import { useCallback } from "react";
import { GameAction, GameState } from "../state/reducer";
import { getGameState, useGameStore } from "../store/gameStore";

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

export const useThunk = () => {
  const dispatch = useGameStore((state) => state.dispatch);

  const dispatchThunk = useCallback(
    (thunk: ThunkAction) => {
      thunk(dispatch, getGameState);
    },
    [dispatch],
  );

  return dispatchThunk;
};
