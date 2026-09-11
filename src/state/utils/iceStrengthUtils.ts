import type { IceCardDefinition } from "../../cards/definitions";
import type { CardInstance } from "../../cards/instance";
import type { GameState } from "../types";

export type IceStrengthContribution = {
  amount: number;
  /** Instance id of the card whose permanent effect contributes */
  sourceId: string;
};

export type IceStrength = {
  base: number;
  /** Non-zero modifier contributions, in registration order */
  contributions: IceStrengthContribution[];
  current: number;
  modifier: number;
};

export const calculateIceStrength = (
  ice: CardInstance,
  definition: IceCardDefinition,
  gameState: GameState,
): IceStrength => {
  const baseStrength = definition.strength;

  const relevantEffects = gameState.boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getIceStrength",
  );

  const contributions = relevantEffects
    .map(({ getModifier, sourceId }) => ({
      amount: getModifier({ gameState, sourceId, targetId: ice.instanceId }),
      sourceId,
    }))
    .filter(({ amount }) => amount !== 0);

  const modifier = contributions.reduce((acc, { amount }) => acc + amount, 0);

  const currentStrength = baseStrength + modifier;

  return {
    base: baseStrength,
    contributions,
    current: currentStrength,
    modifier,
  };
};
