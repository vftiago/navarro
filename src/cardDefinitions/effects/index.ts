/**
 * Effects Module - Central registry for all card effect implementations
 *
 * This module provides type-safe effect lookup by EffectId.
 * Effects are implementations of card behaviors that can be reused across cards.
 */
import { commonEffects } from "./common";
import { iceEffects } from "./ice";
import { programEffects } from "./programs";
import type { EffectId } from "./registry";
import { scriptEffects } from "./scripts";
import { trapEffects } from "./traps";
import type { EffectImplementation } from "./types";

// Combined effect registry
const effectRegistry: Record<string, EffectImplementation> = {
  ...commonEffects,
  ...iceEffects,
  ...programEffects,
  ...scriptEffects,
  ...trapEffects,
};

/**
 * Get an effect implementation by ID
 * @throws Error if effect ID is not found
 */
export const getEffectById = (id: EffectId): EffectImplementation => {
  const effect = effectRegistry[id];
  if (!effect) {
    throw new Error(`Effect not found: ${id}`);
  }
  return effect;
};

/**
 * Check if an effect ID exists in the registry
 */
export const hasEffect = (id: string): id is EffectId => {
  return id in effectRegistry;
};

/**
 * Get all registered effect IDs
 */
export const getAllEffectIds = (): EffectId[] => {
  return Object.keys(effectRegistry) as EffectId[];
};

// Re-export types and registry
export * from "./registry";
export * from "./types";
