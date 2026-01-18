import type { IcePlayingCard } from "../../cardDefinitions/card";

export enum ServerName {
  HQ = "HQ",
  RD = "R&D",
  ARCHIVES = "Archives",
}

export type ServerData = {
  installedIce: IcePlayingCard[];
};

export type ServerState = {
  servers: Record<ServerName, ServerData>;
  selectedServer: ServerName;
  serverUnencounteredIce: IcePlayingCard[];
  serverCurrentEncounteredIce: IcePlayingCard | null;
  serverSecurityLevel: number;
  serverMaxIceSlots: number;
};

export enum ServerActionTypes {
  MODIFY_SERVER_SECURITY = "MODIFY_SERVER_SECURITY",
  ADD_TO_ICE = "ADD_TO_ICE",
  ADD_TO_UNENCOUNTERED_ICE = "ADD_TO_UNENCOUNTERED_ICE",
  CLEAR_UNENCOUNTERED_ICE = "CLEAR_UNENCOUNTERED_ICE",
  REMOVE_FROM_ICE = "REMOVE_FROM_ICE",
  REMOVE_FROM_UNENCOUNTERED_ICE = "REMOVE_FROM_UNENCOUNTERED_ICE",
  SET_CURRENT_ENCOUNTERED_ICE = "SET_CURRENT_ENCOUNTERED_ICE",
  SET_SELECTED_SERVER = "SET_SELECTED_SERVER",
}

export type ServerAction =
  | { type: ServerActionTypes.MODIFY_SERVER_SECURITY; payload: number }
  | {
      type: ServerActionTypes.ADD_TO_ICE;
      payload: { ice: IcePlayingCard; server: ServerName };
    }
  | {
      type: ServerActionTypes.ADD_TO_UNENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard };
    }
  | { type: ServerActionTypes.CLEAR_UNENCOUNTERED_ICE }
  | {
      type: ServerActionTypes.REMOVE_FROM_ICE;
      payload: { ice: IcePlayingCard; server: ServerName };
    }
  | {
      type: ServerActionTypes.REMOVE_FROM_UNENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard };
    }
  | {
      type: ServerActionTypes.SET_CURRENT_ENCOUNTERED_ICE;
      payload: { ice: IcePlayingCard | null };
    }
  | {
      type: ServerActionTypes.SET_SELECTED_SERVER;
      payload: { server: ServerName };
    };
