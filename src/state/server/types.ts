import type { IcePlayingCard } from "../../cardDefinitions/card";

export type ServerState = {
  serverInstalledIce: IcePlayingCard[];
  serverUnencounteredIce: IcePlayingCard[];
  serverCurrentEncounteredIce: IcePlayingCard | null;
  serverSecurityLevel: number;
  serverMaxIceSlots: number;
};

export enum ServerActionTypes {
  MODIFY_SERVER_SECURITY = "MODIFY_SERVER_SECURITY",
  ADD_TO_ICE = "ADD_TO_ICE",
  ADD_TO_UNENCOUNTERED_ICE = "ADD_TO_UNENCOUNTERED_ICE",
  REMOVE_FROM_ICE = "REMOVE_FROM_ICE",
  REMOVE_FROM_UNENCOUNTERED_ICE = "REMOVE_FROM_UNENCOUNTERED_ICE",
  SET_CURRENT_ENCOUNTERED_ICE = "SET_CURRENT_ENCOUNTERED_ICE",
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
    }
  | {
      type: ServerActionTypes.SET_CURRENT_ENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard | null };
    };
