import type { PendingActionType, PendingState } from "./types";
import { PendingActionTypes } from "./types";

export const initialPendingState: PendingState = {
  pendingAction: null,
};

export const pendingReducer = (
  state: PendingState = initialPendingState,
  action: PendingActionType,
): PendingState => {
  switch (action.type) {
    case PendingActionTypes.SET_PENDING_ACTION:
      return {
        ...state,
        pendingAction: action.payload,
      };

    case PendingActionTypes.CLEAR_PENDING_ACTION:
      return {
        ...state,
        pendingAction: null,
      };

    default:
      return state;
  }
};
