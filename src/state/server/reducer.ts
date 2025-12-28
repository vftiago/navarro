import type { ServerAction, ServerState } from "./types";
import { ServerActionTypes } from "./types";

export const initialServerState: ServerState = {
  serverCurrentEncounteredIce: null,
  serverInstalledIce: [],
  serverMaxIceSlots: 3,
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

    case ServerActionTypes.ADD_TO_ICE:
      return {
        ...state,
        serverInstalledIce: [...state.serverInstalledIce, action.payload.ice],
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
          (ice) => ice.deckContextId !== action.payload.ice.deckContextId,
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
