import { GameState } from "../reducer";
import { TurnPhase, TurnSubPhase } from "./types";

export const getTurnRemainingClicks = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getTurnCurrentPhase = (state: GameState): TurnPhase =>
  state.turnState.turnCurrentPhase;

export const getTurnCurrentSubPhase = (state: GameState): TurnSubPhase =>
  state.turnState.turnCurrentSubPhase;

export const getTurnNextPhase = (state: GameState): null | TurnPhase =>
  state.turnState.turnNextPhase;

export const getCurrentTurn = (state: GameState): number =>
  state.turnState.turnNumber;

export const getCurrentClick = (state: GameState): number =>
  state.turnState.turnRemainingClicks;
