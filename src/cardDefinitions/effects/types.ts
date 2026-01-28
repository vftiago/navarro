import type { ReactNode } from "react";
import type { GameAction, GameState, ThunkAction } from "../../state/types";
import type { EffectCost, Keyword, TriggerMoment } from "../card";

/**
 * Parameters passed to effect functions
 */
export type EffectParams = {
  gameState: GameState;
  sourceId?: string;
  targetId?: string;
};

/**
 * Effect implementation - the behavior of a card effect
 *
 * This mirrors CardEffect but is designed to be looked up by EffectId.
 * Effects can return either actions (simple) or thunks (complex multi-step).
 */
export type EffectImplementation = {
  /** Optional costs required to activate this effect */
  costs?: EffectCost[];
  /** Optional keyword this effect represents */
  keyword?: Keyword;
  /** When this effect triggers */
  triggerMoment: TriggerMoment;
  /** Returns actions to dispatch (simple effects) */
  getActions?: (params: EffectParams) => GameAction[];
  /** Returns a thunk for complex multi-step effects */
  getThunk?: (params: EffectParams) => ThunkAction;
  /** Returns the text description of this effect */
  getText: () => ReactNode;
};

/**
 * A map of effect IDs to their implementations
 */
export type EffectRegistry = Record<string, EffectImplementation>;
