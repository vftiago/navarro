import {
  TurnAction,
  TurnActionTypes,
  TurnPhase,
  TurnState,
  TurnSubPhase,
} from "./types";

export const initialTurnState: TurnState = {
  phaseChangeCounter: 0,
  turnCurrentPhase: TurnPhase.Draw,
  turnCurrentSubPhase: TurnSubPhase.Start,
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
        turnCurrentPhase: action.payload,
      };

    case TurnActionTypes.SET_TURN_CURRENT_SUB_PHASE:
      return {
        ...state,
        phaseChangeCounter: state.phaseChangeCounter + 1,
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
