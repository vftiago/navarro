import { useCallback } from "react";
import { getGameState, useGameStore } from "./store";
import type { ThunkAction } from "./types";

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
