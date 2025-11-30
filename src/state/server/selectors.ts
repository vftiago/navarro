import type { IcePlayingCard } from "../../cardDefinitions/card";
import type { GameState } from "../types";

export const getServerSecurityLevel = (state: GameState): number =>
  state.serverState.serverSecurityLevel;

export const getServerInstalledIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverInstalledIce;

export const getServerUnencounteredIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverUnencounteredIce;

export const getServerRezzedIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverInstalledIce.filter((ice) => ice.isRezzed);

export const getIceStrength = (
  state: GameState,
  iceCard: IcePlayingCard,
): number => {
  const baseStrength = iceCard.getStrength(state);
  const targetId = iceCard.deckContextId;

  const relevantEffects = state.boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getIceStrength",
  );

  const modifier = relevantEffects.reduce((acc, { getModifier, sourceId }) => {
    const modifier = getModifier({
      gameState: state,
      sourceId,
      targetId,
    });

    return acc + modifier;
  }, 0);

  return baseStrength + modifier;
};
