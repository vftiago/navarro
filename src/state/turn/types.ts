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
  phaseCounter: number;
  runProgressState: RunProgressState;
  turnCurrentPhase: TurnPhase;
  turnNumber: number;
  turnRemainingClicks: number;
};

export enum TurnActionTypes {
  INCREMENT_PHASE_COUNTER = "INCREMENT_PHASE_COUNTER",
  INCREMENT_TURN = "INCREMENT_TURN",
  MODIFY_CLICKS = "MODIFY_CLICKS",
  SET_CLICKS = "SET_CLICKS",
  SET_RUN_PROGRESS_STATE = "SET_RUN_PROGRESS_STATE",
  SET_TURN_CURRENT_PHASE = "SET_TURN_CURRENT_PHASE",
}

export type TurnAction =
  | { payload: number; type: TurnActionTypes.MODIFY_CLICKS }
  | { payload: number; type: TurnActionTypes.SET_CLICKS }
  | { payload: RunProgressState; type: TurnActionTypes.SET_RUN_PROGRESS_STATE }
  | { payload: TurnPhase; type: TurnActionTypes.SET_TURN_CURRENT_PHASE }
  | { type: TurnActionTypes.INCREMENT_PHASE_COUNTER }
  | { type: TurnActionTypes.INCREMENT_TURN };
