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
