import type { IceCardInstance } from "../../cards/instance";
import type { GameState } from "../types";
import type { ServerName } from "./types";

export const getServerSecurityLevel = (state: GameState): number =>
  state.serverState.serverSecurityLevel;

export const getSelectedServer = (state: GameState): ServerName =>
  state.serverState.selectedServer;

export const getServerInstalledIce = (state: GameState): IceCardInstance[] =>
  state.serverState.servers[state.serverState.selectedServer].installedIce;

export const getServerInstalledIceByName = (
  state: GameState,
  server: ServerName,
): IceCardInstance[] => state.serverState.servers[server].installedIce;

export const getServerUnencounteredIce = (
  state: GameState,
): IceCardInstance[] => state.serverState.serverUnencounteredIce;

export const getServerRezzedIce = (state: GameState): IceCardInstance[] =>
  state.serverState.servers[
    state.serverState.selectedServer
  ].installedIce.filter((ice) => ice.isRezzed);
