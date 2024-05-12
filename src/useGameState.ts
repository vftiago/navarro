import { useState } from "react";
import { CardT } from "./cards/cards";

export const useGameState = (initialState: {
  turn: number;
  tick: number;
  hand: CardT[];
}) => {
  const { turn, tick, hand } = initialState;

  const [isNewTurn, setIsNewTurn] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(turn);
  const [currentTick, setCurrentTick] = useState(tick);
  const [currentPlayerCards, setCurrentPlayerCards] = useState(hand);

  return {
    isNewTurn,
    setIsNewTurn,
    currentTurn,
    setCurrentTurn,
    currentTick,
    setCurrentTick,
    currentPlayerCards,
    setCurrentPlayerCards,
  };
};
