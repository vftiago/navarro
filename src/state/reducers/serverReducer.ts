import {
  GameAction,
  ServerState,
  INSTALL_ICE,
  INCREMENT_SECURITY,
  DECREMENT_SECURITY,
} from "../types";

export const initialServerState: ServerState = {
  serverInstalledIce: [],
  serverSecurityLevel: 0,
};

export const serverReducer = (
  state: ServerState = initialServerState,
  action: GameAction,
): ServerState => {
  switch (action.type) {
    case INCREMENT_SECURITY:
      return {
        ...state,
        serverSecurityLevel: state.serverSecurityLevel + 1,
      };

    case DECREMENT_SECURITY:
      return {
        ...state,
        serverSecurityLevel: Math.max(0, state.serverSecurityLevel - 1),
      };

    case INSTALL_ICE:
      return {
        ...state,
        serverInstalledIce: [...state.serverInstalledIce, action.payload.ice],
      };

    default:
      return state;
  }
};
