import type { BoardAction, PermanentEffectT } from "./types";
import { BoardActionTypes } from "./types";

export const addPermanentEffect = (effect: PermanentEffectT): BoardAction => ({
  payload: { effect },
  type: BoardActionTypes.ADD_PERMANENT_EFFECT,
});

export const removePermanentEffect = (sourceId: string): BoardAction => ({
  payload: { sourceId },
  type: BoardActionTypes.REMOVE_PERMANENT_EFFECT,
});
