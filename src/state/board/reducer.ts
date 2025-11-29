import { BoardAction, BoardActionTypes, BoardState } from "./types";

export const initialBoardState: BoardState = {
  permanentEffects: [],
};

export const boardReducer = (
  state: BoardState = initialBoardState,
  action: BoardAction,
): BoardState => {
  switch (action.type) {
    case BoardActionTypes.ADD_PERMANENT_EFFECT: {
      const { payload } = action;

      return {
        ...state,
        permanentEffects: [...state.permanentEffects, { ...payload.effect }],
      };
    }

    case BoardActionTypes.REMOVE_PERMANENT_EFFECT: {
      const { payload } = action;
      const newPermanentEffects = state.permanentEffects.filter(
        (effect) => effect.sourceId !== payload.sourceId,
      );

      return {
        ...state,
        permanentEffects: newPermanentEffects,
      };
    }

    default:
      return state;
  }
};
