export enum TurnPhase {
  Corp = "Corp",
  Draw = "Draw",
  End = "End",
  Main = "Main",
  Play = "Play",
  Run = "Run",
  Upkeep = "Upkeep",
}

export enum RunProgressState {
  NOT_IN_RUN = "NOT_IN_RUN",
  ENCOUNTERING_ICE = "ENCOUNTERING_ICE",
  ACCESSING_CARDS = "ACCESSING_CARDS",
}

export type TurnState = {
  turnNumber: number;
  turnRemainingClicks: number;
  turnCurrentPhase: TurnPhase;
  turnNextPhase: null | TurnPhase;
  phaseCounter: number;
  runProgressState: RunProgressState;
};

export enum TurnActionTypes {
  SET_CLICKS = "SET_CLICKS",
  MODIFY_CLICKS = "MODIFY_CLICKS",
  SET_TURN_CURRENT_PHASE = "SET_TURN_CURRENT_PHASE",
  SET_TURN_NEXT_PHASE = "SET_TURN_NEXT_PHASE",
  INCREMENT_TURN = "INCREMENT_TURN",
  INCREMENT_PHASE_COUNTER = "INCREMENT_PHASE_COUNTER",
  SET_RUN_PROGRESS_STATE = "SET_RUN_PROGRESS_STATE",
}

export type TurnAction =
  | { type: TurnActionTypes.SET_CLICKS; payload: number }
  | { type: TurnActionTypes.MODIFY_CLICKS; payload: number }
  | { type: TurnActionTypes.SET_TURN_CURRENT_PHASE; payload: TurnPhase }
  | { type: TurnActionTypes.SET_TURN_NEXT_PHASE; payload: null | TurnPhase }
  | { type: TurnActionTypes.INCREMENT_TURN }
  | { type: TurnActionTypes.INCREMENT_PHASE_COUNTER }
  | { type: TurnActionTypes.SET_RUN_PROGRESS_STATE; payload: RunProgressState };
