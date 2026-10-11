import type { IceCardInstance } from "../../cards/instance";
import { getRandomIceCard } from "../utils/cardUtils";
import type { ServerAction, ServerState } from "./types";
import { ServerActionTypes, ServerName } from "./types";

/**
 * The opening wall: each server starts with this many random ice, installed
 * face-down so the first run into it is a read of unknowns. Archives is open.
 */
const STARTING_ICE_COUNT: Record<ServerName, number> = {
  [ServerName.ARCHIVES]: 0,
  [ServerName.HQ]: 2,
  [ServerName.RD]: 1,
};

const createStartingIce = (server: ServerName): IceCardInstance[] =>
  Array.from({ length: STARTING_ICE_COUNT[server] }, () => getRandomIceCard());

export const initialServerState: ServerState = {
  selectedServer: ServerName.HQ,
  serverCurrentEncounteredIce: null,
  serverMaxIceSlots: 3,
  servers: {
    [ServerName.ARCHIVES]: {
      installedIce: createStartingIce(ServerName.ARCHIVES),
    },
    [ServerName.HQ]: { installedIce: createStartingIce(ServerName.HQ) },
    [ServerName.RD]: { installedIce: createStartingIce(ServerName.RD) },
  },
  serverSecurityLevel: 0,
  serverUnencounteredIce: [],
};

export const serverReducer = (
  state: ServerState = initialServerState,
  action: ServerAction,
): ServerState => {
  switch (action.type) {
    case ServerActionTypes.MODIFY_SERVER_SECURITY: {
      const { payload } = action;

      return {
        ...state,
        serverSecurityLevel: state.serverSecurityLevel + payload,
      };
    }

    case ServerActionTypes.ADD_TO_ICE: {
      const { ice, server } = action.payload;

      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            installedIce: [...state.servers[server].installedIce, ice],
          },
        },
      };
    }

    case ServerActionTypes.REMOVE_FROM_ICE: {
      const { ice, server } = action.payload;

      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            installedIce: state.servers[server].installedIce.filter(
              (i) => i.instanceId !== ice.instanceId,
            ),
          },
        },
      };
    }

    case ServerActionTypes.REZ_ICE: {
      const { ice, server } = action.payload;
      const rez = (i: IceCardInstance): IceCardInstance =>
        i.instanceId === ice.instanceId ? { ...i, isRezzed: true } : i;

      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            installedIce: state.servers[server].installedIce.map(rez),
          },
        },
        serverUnencounteredIce: state.serverUnencounteredIce.map(rez),
      };
    }

    case ServerActionTypes.SET_SELECTED_SERVER:
      return {
        ...state,
        selectedServer: action.payload.server,
      };

    case ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE:
      return {
        ...state,
        serverUnencounteredIce: [
          ...state.serverUnencounteredIce,
          action.payload.ice,
        ],
      };

    case ServerActionTypes.CLEAR_UNENCOUNTERED_ICE:
      return {
        ...state,
        serverUnencounteredIce: [],
      };

    case ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE:
      return {
        ...state,
        serverUnencounteredIce: state.serverUnencounteredIce.filter(
          (ice) => ice.instanceId !== action.payload.ice.instanceId,
        ),
      };

    case ServerActionTypes.SET_CURRENT_ENCOUNTERED_ICE:
      return {
        ...state,
        serverCurrentEncounteredIce: action.payload.ice,
      };

    default:
      return state;
  }
};
