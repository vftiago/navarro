import type { IcePlayingCard } from "../../cardDefinitions/card";
import type { GameState } from "../types";
import type { ServerName } from "./types";

export const getServerSecurityLevel = (state: GameState): number =>
  state.serverState.serverSecurityLevel;

export const getSelectedServer = (state: GameState): ServerName =>
  state.serverState.selectedServer;

export const getServerInstalledIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.servers[state.serverState.selectedServer].installedIce;

export const getServerInstalledIceByName = (
  state: GameState,
  server: ServerName,
): IcePlayingCard[] => state.serverState.servers[server].installedIce;

export const getServerUnencounteredIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverUnencounteredIce;

export const getServerRezzedIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.servers[
    state.serverState.selectedServer
  ].installedIce.filter((ice) => ice.isRezzed);

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
