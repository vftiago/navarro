import { ReactNode, useReducer } from "react";
import { gameReducer, initialGameState } from "../gameReducer";
import { GameStateContext } from "./GameStateContext";

export const GameStateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameStateContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};
