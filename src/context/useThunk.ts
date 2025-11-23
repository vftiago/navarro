import { useCallback, useRef, useEffect } from "react";
import { GameAction, GameState } from "../state/reducer";
import { useGameState } from "./useGameState";

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

export const useThunk = () => {
  const { dispatch, gameState } = useGameState();

  const stateRef = useRef<GameState>(gameState);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const dispatchThunk = useCallback(
    (thunk: ThunkAction) => {
      thunk(dispatch, () => stateRef.current);
    },
    [dispatch],
  );

  return dispatchThunk;
};
