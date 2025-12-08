import type { GameState } from "../types";
import type { TurnPhase } from "./types";

export const getCurrentClick = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getCurrentTurn = (state: GameState): number =>
  state.turnState.turnNumber;

export const getTurnCurrentPhase = (state: GameState): TurnPhase =>
  state.turnState.turnCurrentPhase;

export const getTurnRemainingClicks = (state: GameState): number =>
  state.turnState.turnRemainingClicks;
