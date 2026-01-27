import type { IcePlayingCard } from "../../cardDefinitions/card";
import type { GameState } from "../types";

export type IceStrength = {
  base: number;
  current: number;
  modifier: number;
};

export const calculateIceStrength = (
  ice: IcePlayingCard,
  gameState: GameState,
): IceStrength => {
  const baseStrength = ice.getStrength(gameState);

  const relevantEffects = gameState.boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getIceStrength",
  );

  const modifier = relevantEffects.reduce((acc, { getModifier, sourceId }) => {
    const mod = getModifier({
      gameState,
      sourceId,
      targetId: ice.deckContextId,
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
