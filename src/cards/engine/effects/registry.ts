/**
 * Effect Registry - Maps every EffectId to its implementation
 *
 * The registry's mapped type guarantees at compile time that every id in
 * `EffectParamsMap` has exactly one implementation with matching params.
 *
 * Genuinely one-off, card-specific effects belong in a `unique.ts` spread
 * into this registry — currently every effect has decomposed into
 * parameterized primitives (+ conditions), so no such file exists.
 */
import { primitiveEffects } from "./primitives";
import type { EffectId, EffectImplementation, EffectParamsMap } from "./types";

export const effectRegistry: {
  [K in EffectId]: EffectImplementation<EffectParamsMap[K]>;
} = {
  ...primitiveEffects,
};

/**
 * Get an effect implementation by id, typed to its params shape
 */
export const getEffectImplementation = <K extends EffectId>(
  id: K,
): EffectImplementation<EffectParamsMap[K]> => {
  return effectRegistry[id];
};
