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
};

export const initialTurnState: TurnState = {
  turnNumber: 1,
  turnRemainingClicks: 3,
  turnCurrentPhase: TurnPhase.Draw,
  turnCurrentSubPhase: TurnSubPhase.Start,
  turnNextPhase: null,
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

export const setClicks = (clicks: number): TurnAction => ({
  type: TurnActionTypes.SET_CLICKS,
  payload: clicks,
});

export const modifyClicks = (amount: number): TurnAction => ({
  type: TurnActionTypes.MODIFY_CLICKS,
  payload: amount,
});

export const setTurnCurrentPhase = (phase: TurnPhase): TurnAction => ({
  type: TurnActionTypes.SET_TURN_CURRENT_PHASE,
  payload: phase,
});

export const setTurnCurrentSubPhase = (subPhase: TurnSubPhase): TurnAction => ({
  type: TurnActionTypes.SET_TURN_CURRENT_SUB_PHASE,
  payload: subPhase,
});

export const setTurnNextPhase = (phase: null | TurnPhase): TurnAction => ({
  type: TurnActionTypes.SET_TURN_NEXT_PHASE,
  payload: phase,
});

export const incrementTurn = (): TurnAction => ({
  type: TurnActionTypes.INCREMENT_TURN,
});

export const turnReducer = (
  state: TurnState = initialTurnState,
  action: TurnAction,
): TurnState => {
  switch (action.type) {
    case TurnActionTypes.SET_CLICKS:
      return {
        ...state,
        turnRemainingClicks: action.payload,
      };

    case TurnActionTypes.MODIFY_CLICKS:
      return {
        ...state,
        turnRemainingClicks: state.turnRemainingClicks + action.payload,
      };

    case TurnActionTypes.SET_TURN_CURRENT_PHASE:
      return {
        ...state,
        turnCurrentPhase: action.payload,
      };

    case TurnActionTypes.SET_TURN_CURRENT_SUB_PHASE:
      return {
        ...state,
        turnCurrentSubPhase: action.payload,
      };

    case TurnActionTypes.SET_TURN_NEXT_PHASE:
      return {
        ...state,
        turnNextPhase: action.payload,
      };

    case TurnActionTypes.INCREMENT_TURN:
      return {
        ...state,
        turnNumber: state.turnNumber + 1,
      };

    default:
      return state;
  }
};
