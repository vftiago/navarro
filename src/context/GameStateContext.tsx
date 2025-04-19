import { createContext, Dispatch } from "react";
import { GameState, GameAction } from "../state/gameReducer";

export type GameStateContextType = {
  gameState: GameState;
  dispatch: Dispatch<GameAction>;
};

export const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined,
);
