/**
 * Legacy Adapter - Bridges the new effect engine to the old CardEffect shape
 *
 * Lets `executeCardEffects` and the existing card UI consume engine
 * `EffectSpec`s unchanged during the migration.
 *
 * TODO(card-registry Phase 5): delete once nothing consumes `CardEffect`.
 */
import type { CardEffect } from "../../../cardDefinitions/card";
import { renderEffectText } from "../text";
import { getConditionImplementation } from "./conditions";
import { getEffectImplementation } from "./registry";
import type {
  ConditionImplementation,
  EffectContext,
  EffectImplementation,
  EffectSpec,
} from "./types";

export const specToCardEffect = (spec: EffectSpec): CardEffect => {
  // Erase the per-id params links; the `EffectSpec`/`ConditionSpec`
  // distributive unions already guaranteed that params match their ids
  // at the call site.
  const impl = getEffectImplementation(
    spec.effect,
  ) as EffectImplementation<unknown>;
  const params: unknown = spec.params;
  const condition = spec.condition && {
    impl: getConditionImplementation(
      spec.condition.check,
    ) as ConditionImplementation<unknown>,
    params: spec.condition.params as unknown,
  };

  const isConditionMet = (context: EffectContext): boolean => {
    return condition ? condition.impl.isMet(condition.params, context) : true;
  };

  const cardEffect: CardEffect = {
    getText: () => renderEffectText(spec),
    triggerMoment: spec.trigger ?? impl.defaultTrigger,
  };

  const costs = spec.costs ?? impl.costs;
  if (costs) {
    cardEffect.costs = costs;
  }

  const { getActions, getThunk } = impl;
  if (getActions) {
    cardEffect.getActions = (context) =>
      isConditionMet(context) ? getActions(params, context) : [];
  }
  if (getThunk) {
    cardEffect.getThunk = (context) =>
      isConditionMet(context) ? getThunk(params, context) : () => undefined;
  }

  return cardEffect;
};
