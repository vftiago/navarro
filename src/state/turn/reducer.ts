import {
  RunProgressState,
  type TurnAction,
  TurnActionTypes,
  TurnPhase,
  type TurnState,
} from "./types";

export const initialTurnState: TurnState = {
  phaseCounter: 0,
  runProgressState: RunProgressState.NOT_IN_RUN,
  turnCurrentPhase: TurnPhase.Draw,
  turnNextPhase: null,
  turnNumber: 1,
  turnRemainingClicks: 3,
};

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
        phaseCounter: state.phaseCounter + 1,
        turnCurrentPhase: action.payload,
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

    case TurnActionTypes.INCREMENT_PHASE_COUNTER:
      return {
        ...state,
        phaseCounter: state.phaseCounter + 1,
      };

    case TurnActionTypes.SET_RUN_PROGRESS_STATE:
      return {
        ...state,
        runProgressState: action.payload,
      };

    default:
      return state;
  }
};
