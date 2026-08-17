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
import type {
  EffectCost,
  IceSubtype,
  TriggerMoment,
} from "../../../cardDefinitions/card";
import type { GameAction, GameState, ThunkAction } from "../../../state/types";

/**
 * Runtime context passed to effect implementations when they execute
 */
export type EffectContext = {
  gameState: GameState;
  sourceId?: string;
  targetId?: string;
};

/**
 * Binds each effect id to its params shape (`void` = no params).
 *
 * Parameterized primitives live in `primitives.ts`; genuinely one-off,
 * card-specific effects live in `unique.ts`.
 */
export type EffectParamsMap = {
  break_subroutine: { iceSubtype: IceSubtype };
  draw: { amount: number };
  end_run: void;
  gain_victory_points: { amount: number };
  initiate_run: void;
  modify_cards_per_turn: { amount: number };
  modify_clicks: { amount: number };
  modify_other_ice_strength: { amount: number };
  modify_server_security: { amount: number };
  modify_signal: { amount: number };
  modify_tags: { amount: number };
  net_damage_per_security: void;
  strength_per_server_security: void;
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
export type ConditionImplementation<P = void> = {
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
  } & (ConditionParamsMap[K] extends void
    ? { params?: never }
    : { params: ConditionParamsMap[K] });
}[ConditionId];

/**
 * The code half of an effect, registered once per effect id
 */
export type EffectImplementation<P = void> = {
  /** Default costs required to activate this effect (spec can override) */
  costs?: EffectCost[];
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
 * compile-time error, while void-params effects forbid `params` entirely.
 */
export type EffectSpec = {
  [K in EffectId]: {
    /** Gate the effect behind a condition: "on trigger: if condition, effect" */
    condition?: ConditionSpec;
    /** Override the implementation's default costs */
    costs?: EffectCost[];
    effect: K;
    /** Override the generated rules text */
    text?: string;
    /** Override the implementation's default trigger */
    trigger?: TriggerMoment;
  } & (EffectParamsMap[K] extends void
    ? { params?: never }
    : { params: EffectParamsMap[K] });
}[EffectId];
