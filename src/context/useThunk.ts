import { useCallback, useRef, useEffect } from "react";
import { useGameState } from "./useGameState";
import { GameAction, GameState } from "../state/reducer";

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;

export const useThunk = () => {
  const { gameState, dispatch } = useGameState();

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
