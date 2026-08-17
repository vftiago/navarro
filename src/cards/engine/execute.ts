/**
 * Effect Execution - Runs a card's effects against game state
 *
 * The runtime counterpart of `resolveEffectSpecs`: filters a card's full
 * effect list by trigger and executes each spec's implementation, honoring
 * conditions. This is the only execution path — phases never touch effect
 * implementations directly.
 */
import type { TriggerMoment } from "../../cardDefinitions/card";
import type { GameAction, GameState } from "../../state/types";
import type { CardDefinition } from "../definitions";
import type { CardInstance } from "../instance";
import { resolveCard } from "../instance";
import { getConditionImplementation } from "./effects/conditions";
import { getEffectImplementation } from "./effects/registry";
import type {
  ConditionImplementation,
  EffectContext,
  EffectImplementation,
  EffectSpec,
} from "./effects/types";
import { resolveEffectSpecs } from "./resolve";
import { getEffectiveTrigger } from "./text";

type Dispatch = (action: GameAction) => void;
type GetState = () => GameState;

/**
 * The card's resolved effects that fire at the given trigger
 */
export const getEffectSpecsByTrigger = (
  definition: CardDefinition,
  trigger: TriggerMoment,
): EffectSpec[] => {
  return resolveEffectSpecs(definition).filter(
    (spec) => getEffectiveTrigger(spec) === trigger,
  );
};

const isConditionMet = (spec: EffectSpec, context: EffectContext): boolean => {
  if (!spec.condition) {
    return true;
  }
  // Erase the per-id params link; ConditionSpec guaranteed the match
  const impl = getConditionImplementation(
    spec.condition.check,
  ) as ConditionImplementation<unknown>;
  return impl.isMet(spec.condition.params, context);
};

/**
 * Execute a single effect spec (checks its condition first)
 */
export const executeEffectSpec = (
  spec: EffectSpec,
  dispatch: Dispatch,
  getState: GetState,
  context: EffectContext,
): void => {
  if (!isConditionMet(spec, context)) {
    return;
  }

  // Erase the per-id params link; EffectSpec guaranteed the match
  const impl = getEffectImplementation(
    spec.effect,
  ) as EffectImplementation<unknown>;

  if (impl.getThunk) {
    impl.getThunk(spec.params, context)(dispatch, getState);
  } else if (impl.getActions) {
    impl.getActions(spec.params, context).forEach(dispatch);
  }
};

/**
 * Execute all of a card instance's effects for the given trigger.
 * Each effect sees the game state as of its own execution.
 */
export const executeTriggers = (
  instance: CardInstance,
  trigger: TriggerMoment,
  dispatch: Dispatch,
  getState: GetState,
  targetId?: string,
): void => {
  const definition = resolveCard(instance);
  getEffectSpecsByTrigger(definition, trigger).forEach((spec) => {
    executeEffectSpec(spec, dispatch, getState, {
      gameState: getState(),
      sourceId: instance.instanceId,
      ...(targetId && { targetId }),
    });
  });
};
