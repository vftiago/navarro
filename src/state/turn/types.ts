export enum TurnPhase {
  Start = "Start",
  Draw = "Draw",
  Main = "Main",
  Play = "Play",
  Run = "Run",
  Encounter = "Encounter",
  Access = "Access",
  Fetch = "Fetch",
  Discard = "Discard",
  End = "End",
  Corp = "Corp",
}

export enum TurnSubPhase {
  Start = "Start",
  Process = "Process",
  End = "End",
}

export type TurnState = {
  turnNumber: number;
  turnRemainingClicks: number;
  turnCurrentPhase: TurnPhase;
  turnCurrentSubPhase: TurnSubPhase;
  turnNextPhase: null | TurnPhase;
  phaseChangeCounter: number;
};

export enum TurnActionTypes {
  SET_CLICKS = "SET_CLICKS",
  MODIFY_CLICKS = "MODIFY_CLICKS",
  SET_TURN_CURRENT_PHASE = "SET_TURN_CURRENT_PHASE",
  SET_TURN_CURRENT_SUB_PHASE = "SET_TURN_CURRENT_SUB_PHASE",
  SET_TURN_NEXT_PHASE = "SET_TURN_NEXT_PHASE",
  INCREMENT_TURN = "INCREMENT_TURN",
}

export type TurnAction =
  | { type: TurnActionTypes.SET_CLICKS; payload: number }
  | { type: TurnActionTypes.MODIFY_CLICKS; payload: number }
  | { type: TurnActionTypes.SET_TURN_CURRENT_PHASE; payload: TurnPhase }
  | { type: TurnActionTypes.SET_TURN_NEXT_PHASE; payload: null | TurnPhase }
  | { type: TurnActionTypes.SET_TURN_CURRENT_SUB_PHASE; payload: TurnSubPhase }
  | { type: TurnActionTypes.INCREMENT_TURN };
