/**
 * Effect Resolution - The full effect list for a card definition
 *
 * Some effects aren't printed per card but implied by a stat or type rule
 * (single source of truth: an agenda's `victoryPoints` stat implies
 * "Score N on fetch" — card data never repeats it as an effect).
 * Phase 3 adds keyword-granted effects here as well.
 */
import { CardType } from "../../cardDefinitions/card";
import type { CardDefinition } from "../definitions/types";
import type { EffectSpec } from "./effects/types";

/**
 * Effects implied by the card's stats/type rather than listed in its data
 */
export const getImplicitEffects = (
  definition: CardDefinition,
): EffectSpec[] => {
  if (definition.type === CardType.AGENDA) {
    return [
      {
        effect: "gain_victory_points",
        params: { amount: definition.victoryPoints },
      },
    ];
  }
  return [];
};

/**
 * A card's complete effect list: printed effects plus implicit ones
 */
export const resolveEffectSpecs = (
  definition: CardDefinition,
): EffectSpec[] => {
  return [...definition.effects, ...getImplicitEffects(definition)];
};
