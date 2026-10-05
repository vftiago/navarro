import type { IceCardInstance } from "../../cards/instance";
import type { ServerAction } from "./types";
import { type ServerName, ServerActionTypes } from "./types";

export const modifyServerSecurity = (amount: number): ServerAction => ({
  payload: amount,
  type: ServerActionTypes.MODIFY_SERVER_SECURITY,
});

export const addToIce = (
  ice: IceCardInstance,
  server: ServerName,
): ServerAction => ({
  payload: { ice, server },
  type: ServerActionTypes.ADD_TO_ICE,
});

export const addToUnencounteredIce = (ice: IceCardInstance): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE,
});

export const clearUnencounteredIce = (): ServerAction => ({
  type: ServerActionTypes.CLEAR_UNENCOUNTERED_ICE,
});

export const removeFromIce = (
  ice: IceCardInstance,
  server: ServerName,
): ServerAction => ({
  payload: { ice, server },
  type: ServerActionTypes.REMOVE_FROM_ICE,
});

export const removeFromUnencounteredIce = (
  ice: IceCardInstance,
): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE,
});

export const rezIce = (
  ice: IceCardInstance,
  server: ServerName,
): ServerAction => ({
  payload: { ice, server },
  type: ServerActionTypes.REZ_ICE,
});

export const setCurrentEncounteredIce = (
  ice: IceCardInstance | null,
): ServerAction => ({
  payload: { ice },
  type: ServerActionTypes.SET_CURRENT_ENCOUNTERED_ICE,
});

export const setSelectedServer = (server: ServerName): ServerAction => ({
  payload: { server },
  type: ServerActionTypes.SET_SELECTED_SERVER,
});
