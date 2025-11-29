import { discardHand } from "../player";
import {
  setTurnCurrentPhase,
  setTurnCurrentSubPhase,
  TurnPhase,
  TurnSubPhase,
} from "../turn";
import { ThunkAction } from "../types";

export const startEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.End));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};

export const processEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(discardHand());
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

export const endEndPhase = (): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Corp));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  };
};
