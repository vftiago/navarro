import type { IceCardDefinition } from "../../cards/definitions";
import type { CardInstance } from "../../cards/instance";
import type { GameState } from "../types";

export type IceStrength = {
  base: number;
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

  const modifier = relevantEffects.reduce((acc, { getModifier, sourceId }) => {
    const mod = getModifier({
      gameState,
      sourceId,
      targetId: ice.instanceId,
    });

    return acc + mod;
  }, 0);

  const currentStrength = baseStrength + modifier;

  return {
    base: baseStrength,
    current: currentStrength,
    modifier,
  };
};
