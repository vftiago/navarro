import type { GameAction, GameState, ThunkAction } from "../../../state/types";
/**
 * Effect Engine Types
 *
 * The engine splits every effect into two halves:
 *
 * - `EffectSpec` — pure data, what card definitions contain
 *   (e.g. `{ effect: "draw", params: { amount: 3 } }`)
 * - `EffectImplementation` — code, registered once per effect id
 *
 * `EffectParamsMap` is the single source of truth binding each effect id to
 * its params shape, so specs are fully type-checked at the call site.
 */
import type { TriggerMoment } from "../../enums";

/**
 * Runtime context passed to effect implementations when they execute
 */
export type EffectContext = {
  gameState: GameState;
  sourceId?: string;
  targetId?: string;
};

/**
 * Binds each effect id to its params shape (`undefined` = no params).
 *
 * Parameterized primitives live in `primitives.ts`; genuinely one-off,
 * card-specific effects live in `unique.ts`.
 */
export type EffectParamsMap = {
  destroy_all_programs: undefined;
  draw: { amount: number };
  end_run: undefined;
  gain_victory_points: { amount: number };
  initiate_run: undefined;
  modify_cards_per_turn: { amount: number };
  modify_clicks: { amount: number };
  modify_other_ice_strength: { amount: number };
  modify_server_security: { amount: number };
  modify_signal: { amount: number };
  modify_tags: { amount: number };
  net_damage_per_security: undefined;
  strength_per_server_security: undefined;
};

export type EffectId = keyof EffectParamsMap;

/**
 * Binds each condition id to its params shape.
 *
 * Conditions are named, registered predicates — deliberately NOT a generic
 * `{ stat, op, value }` expression language. Implementations live in
 * `conditions.ts`.
 */
export type ConditionParamsMap = {
  server_security_at_least: { level: number };
};

export type ConditionId = keyof ConditionParamsMap;

/**
 * The code half of a condition, registered once per condition id
 */
export type ConditionImplementation<P = undefined> = {
  /** Returns the generated text fragment, e.g. "if the server security level is 3 or more" */
  getText: (params: P) => string;
  /** Evaluated at effect execution time */
  isMet: (params: P, context: EffectContext) => boolean;
};

/**
 * The data half of a condition — attached to an `EffectSpec` to gate it:
 * "on trigger: if condition, effect"
 */
export type ConditionSpec = {
  [K in ConditionId]: {
    check: K;
  } & (ConditionParamsMap[K] extends undefined
    ? { params?: never }
    : { params: ConditionParamsMap[K] });
}[ConditionId];

/**
 * The code half of an effect, registered once per effect id
 */
export type EffectImplementation<P = undefined> = {
  /** When this effect triggers unless the spec overrides it */
  defaultTrigger: TriggerMoment;
  /** Returns actions to dispatch (simple effects) */
  getActions?: (params: P, context: EffectContext) => GameAction[];
  /** Returns generated rules text derived from params */
  getText: (params: P) => string;
  /** Returns a thunk for complex multi-step effects */
  getThunk?: (params: P, context: EffectContext) => ThunkAction;
};

/**
 * The data half of an effect — what card definitions contain.
 *
 * A distributive union over `EffectParamsMap`: `effect` narrows `params`,
 * so `{ effect: "draw" }` without `params: { amount: number }` is a
 * compile-time error, while no-params effects forbid `params` entirely.
 */
export type EffectSpec = {
  [K in EffectId]: {
    /** Gate the effect behind a condition: "on trigger: if condition, effect" */
    condition?: ConditionSpec;
    effect: K;
    /** Override the generated rules text */
    text?: string;
    /** Override the implementation's default trigger */
    trigger?: TriggerMoment;
  } & (EffectParamsMap[K] extends undefined
    ? { params?: never }
    : { params: EffectParamsMap[K] });
}[EffectId];
