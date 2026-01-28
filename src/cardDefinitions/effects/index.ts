/**
 * Effects Module - Central registry for all card effect implementations
 *
 * This module provides type-safe effect lookup by EffectId.
 * Effects are implementations of card behaviors that can be reused across cards.
 */
import type { ReactNode } from "react";
import type { CardEffect, TriggerMoment } from "../card";
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

/**
 * Options for customizing an effect when used by a card
 */
export type EffectOptions = {
  /** Override the default trigger moment */
  triggerMoment?: TriggerMoment;
  /** Override the default text */
  getText?: () => ReactNode;
};

/**
 * Create a CardEffect from an EffectId with optional overrides
 *
 * This allows cards to reference centralized effects while customizing
 * trigger moments or text for their specific use case.
 *
 * @example
 * // Use effect with default settings
 * effect(EffectId.LOSE_CLICKS_1)
 *
 * // Override trigger moment
 * effect(EffectId.LOSE_CLICKS_1, { triggerMoment: TriggerMoment.ON_ENCOUNTER })
 *
 * // Override text
 * effect(EffectId.GAIN_TAG_1, { getText: () => "On Fetch, gain 1 tag." })
 */
export const effect = (id: EffectId, options?: EffectOptions): CardEffect => {
  const impl = getEffectById(id);
  return {
    ...impl,
    ...(options?.triggerMoment && { triggerMoment: options.triggerMoment }),
    ...(options?.getText && { getText: options.getText }),
  };
};

// Re-export types and registry
export * from "./registry";
export * from "./types";
