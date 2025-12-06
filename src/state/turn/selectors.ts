import type { GameState } from "../types";
import type { TurnPhase } from "./types";

export const getTurnRemainingClicks = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getTurnCurrentPhase = (state: GameState): TurnPhase =>
  state.turnState.turnCurrentPhase;

export const getTurnNextPhase = (state: GameState): null | TurnPhase =>
  state.turnState.turnNextPhase;

export const getCurrentTurn = (state: GameState): number =>
  state.turnState.turnNumber;

export const getCurrentClick = (state: GameState): number =>
  state.turnState.turnRemainingClicks;
