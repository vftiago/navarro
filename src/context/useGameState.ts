import { useContext } from "react";
import { GameStateContext, GameStateContextType } from "./GameStateContext";

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
