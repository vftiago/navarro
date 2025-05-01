import { IcePlayingCard } from "../../cardDefinitions/card";

export type ServerState = {
  serverInstalledIce: IcePlayingCard[];
  serverUnencounteredIce: IcePlayingCard[];
  serverSecurityLevel: number;
};

export const initialServerState: ServerState = {
  serverInstalledIce: [],
  serverUnencounteredIce: [],
  serverSecurityLevel: 0,
};

export enum ServerActionTypes {
  MODIFY_SERVER_SECURITY = "MODIFY_SERVER_SECURITY",
  ADD_TO_ICE = "ADD_TO_ICE",
  ADD_TO_UNENCOUNTERED_ICE = "ADD_TO_UNENCOUNTERED_ICE",
  REMOVE_FROM_ICE = "REMOVE_FROM_ICE",
  REMOVE_FROM_UNENCOUNTERED_ICE = "REMOVE_FROM_UNENCOUNTERED_ICE",
}

export type ServerAction =
  | { type: ServerActionTypes.MODIFY_SERVER_SECURITY; payload: number }
  | { type: ServerActionTypes.ADD_TO_ICE; payload: { ice: IcePlayingCard } }
  | {
      type: ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard };
    }
  | {
      type: ServerActionTypes.REMOVE_FROM_ICE;
      payload: { ice: IcePlayingCard };
    }
  | {
      type: ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard };
    };

// server actions
export const modifyServerSecurity = (amount: number): ServerAction => ({
  type: ServerActionTypes.MODIFY_SERVER_SECURITY,
  payload: amount,
});

export const addToIce = (ice: IcePlayingCard): ServerAction => ({
  type: ServerActionTypes.ADD_TO_ICE,
  payload: { ice },
});

export const addToUnencounteredIce = (ice: IcePlayingCard): ServerAction => ({
  type: ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE,
  payload: { ice },
});

export const removeFromIce = (ice: IcePlayingCard): ServerAction => ({
  type: ServerActionTypes.REMOVE_FROM_ICE,
  payload: { ice },
});

export const removeFromUnencounteredIce = (
  ice: IcePlayingCard,
): ServerAction => ({
  type: ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE,
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
