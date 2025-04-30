import {
  GameAction,
  TurnState,
  SET_CLICKS,
  MODIFY_CLICKS,
  INCREMENT_TURN,
} from "../types";

export const initialTurnState: TurnState = {
  turnNumber: 1,
  turnRemainingClicks: 3,
};

export const turnReducer = (
  state: TurnState = initialTurnState,
  action: GameAction,
): TurnState => {
  switch (action.type) {
    case SET_CLICKS:
      return {
        ...state,
        turnRemainingClicks: action.payload,
      };

    case MODIFY_CLICKS:
      return {
        ...state,
        turnRemainingClicks: state.turnRemainingClicks + action.payload,
      };

    case INCREMENT_TURN:
      return {
        ...state,
        turnNumber: state.turnNumber + 1,
      };

    default:
      return state;
  }
};
