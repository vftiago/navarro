import { CardId } from "../../cards/ids";
import { createIceCardInstance } from "../../cards/instance";
import type { ServerAction, ServerState } from "./types";
import { ServerActionTypes, ServerName } from "./types";

/**
 * TEMPORARY (layout testing): pre-installed ice so the wall is populated
 * from turn one. Remove before shipping. Note these skip ON_REZ, so
 * Bad Moon's aura and Fire Wall's scaling are not registered.
 */
const TEST_ICE = [
  CardId.FIRE_WALL,
  CardId.BAD_MOON,
  CardId.BIOMETRIC_AUTHENTICATOR,
].map(createIceCardInstance);

export const initialServerState: ServerState = {
  selectedServer: ServerName.HQ,
  serverCurrentEncounteredIce: null,
  serverMaxIceSlots: 3,
  servers: {
    [ServerName.ARCHIVES]: { installedIce: [] },
    [ServerName.HQ]: { installedIce: TEST_ICE },
    [ServerName.RD]: { installedIce: [] },
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
