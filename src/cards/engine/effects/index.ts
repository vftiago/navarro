/**
 * Effect Engine - Parameterized, data-driven card effects
 *
 * See CARD_REGISTRY.md for the architecture and migration plan.
 */
export { conditionRegistry, getConditionImplementation } from "./conditions";
export { primitiveEffects, type PrimitiveEffectId } from "./primitives";
export { effectRegistry, getEffectImplementation } from "./registry";
export type {
  ConditionId,
  ConditionImplementation,
  ConditionParamsMap,
  ConditionSpec,
  EffectContext,
  EffectId,
  EffectImplementation,
  EffectParamsMap,
  EffectSpec,
} from "./types";
