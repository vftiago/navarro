import type { PendingAction, PendingActionType } from "./types";
import { PendingActionTypes } from "./types";

export const setPendingAction = (action: PendingAction): PendingActionType => ({
  payload: action,
  type: PendingActionTypes.SET_PENDING_ACTION,
});

export const clearPendingAction = (): PendingActionType => ({
  type: PendingActionTypes.CLEAR_PENDING_ACTION,
});
