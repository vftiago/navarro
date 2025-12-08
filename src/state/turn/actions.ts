import type { RunProgressState, TurnAction, TurnPhase } from "./types";
import { TurnActionTypes } from "./types";

export const incrementPhaseCounter = (): TurnAction => ({
  type: TurnActionTypes.INCREMENT_PHASE_COUNTER,
});

export const incrementTurn = (): TurnAction => ({
  type: TurnActionTypes.INCREMENT_TURN,
});

export const modifyClicks = (amount: number): TurnAction => ({
  payload: amount,
  type: TurnActionTypes.MODIFY_CLICKS,
});

export const setClicks = (clicks: number): TurnAction => ({
  payload: clicks,
  type: TurnActionTypes.SET_CLICKS,
});

export const setRunProgressState = (state: RunProgressState): TurnAction => ({
  payload: state,
  type: TurnActionTypes.SET_RUN_PROGRESS_STATE,
});

export const setTurnCurrentPhase = (phase: TurnPhase): TurnAction => ({
  payload: phase,
  type: TurnActionTypes.SET_TURN_CURRENT_PHASE,
});
