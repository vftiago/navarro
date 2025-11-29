import { TurnAction, TurnActionTypes, TurnPhase, TurnSubPhase } from "./types";

export const setClicks = (clicks: number): TurnAction => ({
  payload: clicks,
  type: TurnActionTypes.SET_CLICKS,
});

export const modifyClicks = (amount: number): TurnAction => ({
  payload: amount,
  type: TurnActionTypes.MODIFY_CLICKS,
});

export const setTurnCurrentPhase = (phase: TurnPhase): TurnAction => ({
  payload: phase,
  type: TurnActionTypes.SET_TURN_CURRENT_PHASE,
});

export const setTurnCurrentSubPhase = (subPhase: TurnSubPhase): TurnAction => ({
  payload: subPhase,
  type: TurnActionTypes.SET_TURN_CURRENT_SUB_PHASE,
});

export const setTurnNextPhase = (phase: null | TurnPhase): TurnAction => ({
  payload: phase,
  type: TurnActionTypes.SET_TURN_NEXT_PHASE,
});

export const incrementTurn = (): TurnAction => ({
  type: TurnActionTypes.INCREMENT_TURN,
});
