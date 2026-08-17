/**
 * Condition Registry - Named predicates that gate effects
 *
 * A condition is a registered, typed predicate referenced from card data via
 * `ConditionSpec` (e.g. `{ check: "server_security_at_least", params: { level: 3 } }`).
 * Each condition also contributes a generated text fragment.
 */
import { getServerSecurityLevel } from "../../../state/server";
import type {
  ConditionId,
  ConditionImplementation,
  ConditionParamsMap,
} from "./types";

export const conditionRegistry: {
  [K in ConditionId]: ConditionImplementation<ConditionParamsMap[K]>;
} = {
  server_security_at_least: {
    getText: ({ level }) => `if the server security level is ${level} or more`,
    isMet: ({ level }, { gameState }) =>
      getServerSecurityLevel(gameState) >= level,
  },
};

/**
 * Get a condition implementation by id, typed to its params shape
 */
export const getConditionImplementation = <K extends ConditionId>(
  id: K,
): ConditionImplementation<ConditionParamsMap[K]> => {
  return conditionRegistry[id];
};
