import { IcePlayingCard } from "../../cardDefinitions/card";

export type ServerState = {
  serverInstalledIce: IcePlayingCard[];
  serverSecurityLevel: number;
};

export const initialServerState: ServerState = {
  serverInstalledIce: [],
  serverSecurityLevel: 0,
};

export enum ServerActionTypes {
  MODIFY_SERVER_SECURITY = "MODIFY_SERVER_SECURITY",
  ADD_TO_ICE = "ADD_TO_ICE",
}

export type ServerAction =
  | { type: ServerActionTypes.MODIFY_SERVER_SECURITY; payload: number }
  | { type: ServerActionTypes.ADD_TO_ICE; payload: { ice: IcePlayingCard } };

// server actions
export const modifyServerSecurity = (amount: number): ServerAction => ({
  type: ServerActionTypes.MODIFY_SERVER_SECURITY,
  payload: amount,
});

export const addToIce = (ice: IcePlayingCard): ServerAction => ({
  type: ServerActionTypes.ADD_TO_ICE,
  payload: { ice },
});

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

    default:
      return state;
  }
};
