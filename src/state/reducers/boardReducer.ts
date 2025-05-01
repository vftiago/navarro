import { GameState } from "../reducer";

export type PermanentEffectT = {
  sourceId: string;
  targetSelector: string;
  getModifier: ({
    gameState,
    sourceId,
    targetId,
  }: {
    gameState: GameState;
    sourceId?: string;
    targetId?: string;
  }) => number;
};

export type BoardState = {
  permanentEffects: PermanentEffectT[];
};

export const initialBoardState: BoardState = {
  permanentEffects: [],
};

export enum BoardActionTypes {
  ADD_PERMANENT_EFFECT = "ADD_PERMANENT_EFFECT",
  REMOVE_PERMANENT_EFFECT = "REMOVE_PERMANENT_EFFECT",
}

export type BoardAction =
  | {
      type: BoardActionTypes.ADD_PERMANENT_EFFECT;
      payload: { effect: PermanentEffectT };
    }
  | {
      type: BoardActionTypes.REMOVE_PERMANENT_EFFECT;
      payload: { sourceId: string };
    };

// board actions
export const addPermanentEffect = (effect: PermanentEffectT): BoardAction => ({
  type: BoardActionTypes.ADD_PERMANENT_EFFECT,
  payload: { effect },
});

export const removePermanentEffect = (sourceId: string): BoardAction => ({
  type: BoardActionTypes.REMOVE_PERMANENT_EFFECT,
  payload: { sourceId },
});

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
