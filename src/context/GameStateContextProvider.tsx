import { ReactNode, useReducer } from "react";
import { rootReducer, initialGameState } from "../state/reducer";
import { GameStateContext } from "./GameStateContext";

export const GameStateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [gameState, dispatch] = useReducer(rootReducer, initialGameState);

  return (
    <GameStateContext.Provider value={{ dispatch, gameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
