import type { GameState } from "../types";
import type { PendingAction } from "./types";

export const getPendingAction = (state: GameState): null | PendingAction => {
  return state.pendingState.pendingAction;
};
