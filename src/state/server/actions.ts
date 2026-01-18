import type { IcePlayingCard } from "../../cardDefinitions/card";
import type { ServerAction } from "./types";
import { type ServerName, ServerActionTypes } from "./types";

export const modifyServerSecurity = (amount: number): ServerAction => ({
  payload: amount,
  type: ServerActionTypes.MODIFY_SERVER_SECURITY,
});

export const addToIce = (
  ice: IcePlayingCard,
  server: ServerName,
): ServerAction => ({
  payload: { ice, server },
  type: ServerActionTypes.ADD_TO_ICE,
});

export const addToUnencounteredIce = (ice: IcePlayingCard): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE,
});

export const clearUnencounteredIce = (): ServerAction => ({
  type: ServerActionTypes.CLEAR_UNENCOUNTERED_ICE,
});

export const removeFromIce = (
  ice: IcePlayingCard,
  server: ServerName,
): ServerAction => ({
  payload: { ice, server },
  type: ServerActionTypes.REMOVE_FROM_ICE,
});

export const removeFromUnencounteredIce = (
  ice: IcePlayingCard,
): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE,
});

export const setCurrentEncounteredIce = (
  ice: IcePlayingCard | null,
): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.SET_CURRENT_ENCOUNTERED_ICE,
});

export const setSelectedServer = (server: ServerName): ServerAction => ({
  payload: { server },
  type: ServerActionTypes.SET_SELECTED_SERVER,
});
