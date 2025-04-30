import { IcePlayingCardT, PlayingCardT } from "../cards/card";

export enum GamePhase {
  Draw = "Draw",
  Main = "Main",
  Play = "Play",
  Resolve = "Resolve",
  Access = "Access",
  Fetch = "Fetch",
  Discard = "Discard",
  End = "End",
  Corp = "Corp",
}

export interface PlayerState {
  playerDeck: PlayingCardT[];
  playerHand: PlayingCardT[];
  playerPlayedCard: PlayingCardT[];
  playerDiscardPile: PlayingCardT[];
  playerTrashPile: PlayingCardT[];
  playerScoreArea: PlayingCardT[];
  playerMaxHandSize: number;
  playerCardsPerTurn: number;
  playerClicksPerTurn: number;
  playerTags: number;
  playerVictoryPoints: number;
  playerInstalledPrograms: PlayingCardT[];
}

export interface ServerState {
  serverInstalledIce: IcePlayingCardT[];
  serverSecurityLevel: number;
}
export interface PhaseState {
  currentPhase: GamePhase;
  nextPhase: GamePhase;
}

export interface TurnState {
  turnNumber: number;
  turnRemainingClicks: number;
}

export interface TransitoryState {
  transitoryAccessedCards: PlayingCardT[];
  transitoryPlayedCards: PlayingCardT[];
}

export interface PhaseState {
  currentPhase: GamePhase;
  nextPhase: GamePhase;
}

export interface GameState {
  playerState: PlayerState;
  serverState: ServerState;
  turnState: TurnState;
  phaseState: PhaseState;
  transitoryState: TransitoryState;
}

export const DRAW_PHASE = "game/drawPhase";
export const DISCARD_PHASE = "game/discardPhase";
export const MAIN_PHASE = "game/mainPhase";
export const PLAY_PHASE = "game/playPhase";
export const RESOLVE_PHASE = "game/resolvePhase";
export const ACCESS_PHASE = "game/accessPhase";
export const FETCH_PHASE = "game/fetchPhase";
export const END_PHASE = "game/endPhase";
export const CORP_PHASE = "game/corpPhase";
export const SET_PHASE = "game/setPhase";

export const DRAW_CARDS = "player/drawCards";
export const DISCARD_HAND = "player/discardHand";
export const PLAY_CARD = "player/playCard";
export const ADD_TO_TRASH = "player/addToTrash";
export const ADD_TO_DISCARD = "player/addToDiscard";
export const REMOVE_FROM_HAND = "player/removeFromHand";
export const ADD_TO_PROGRAMS = "player/addToPrograms";

export const INCREMENT_SECURITY = "game/incrementSecurity";
export const DECREMENT_SECURITY = "game/decrementSecurity";
export const MODIFY_SECURITY = "game/modifySecurity";
export const SET_CLICKS = "game/setClicks";
export const MODIFY_CLICKS = "game/modifyClicks";
export const INCREMENT_TURN = "game/incrementTurn";
export const ADD_TO_ACCESSED_CARDS = "game/addToAccessedCards";
export const CLEAR_ACCESSED_CARDS = "game/clearAccessedCards";
export const INSTALL_ICE = "server/addToIce";
export const MODIFY_TAGS = "player/modifyTags";
export const INCREMENT_VICTORY_POINTS = "player/incrementVictoryPoints";

export type SetPhase = {
  type: typeof SET_PHASE;
  payload: {
    nextPhase: GamePhase;
  };
};

export type DrawCardsAction = {
  type: typeof DRAW_CARDS;
  payload: {
    count: number;
  };
};

export type DiscardHandAction = {
  type: typeof DISCARD_HAND;
};

export type PlayCardAction = {
  type: typeof PLAY_CARD;
  payload: {
    card: PlayingCardT;
    index: number;
  };
};

export type AddToTrashAction = {
  type: typeof ADD_TO_TRASH;
  payload: {
    card: PlayingCardT;
  };
};

export type AddToDiscardAction = {
  type: typeof ADD_TO_DISCARD;
  payload: {
    card: PlayingCardT;
  };
};

export type RemoveFromHandAction = {
  type: typeof REMOVE_FROM_HAND;
  payload: {
    index: number;
  };
};

export type AddToProgramsAction = {
  type: typeof ADD_TO_PROGRAMS;
  payload: {
    card: PlayingCardT;
  };
};

export type IncrementSecurityAction = {
  type: typeof INCREMENT_SECURITY;
};

export type DecrementSecurityAction = {
  type: typeof DECREMENT_SECURITY;
};

export type ModifySecurityAction = {
  type: typeof MODIFY_SECURITY;
  payload: number;
};

export type SetTicksAction = {
  type: typeof SET_CLICKS;
  payload: number;
};

export type ModifyClicksAction = {
  type: typeof MODIFY_CLICKS;
  payload: number;
};

export type IncrementTurnAction = {
  type: typeof INCREMENT_TURN;
};

export type AddToAccessedCardsAction = {
  type: typeof ADD_TO_ACCESSED_CARDS;
  payload: {
    cards: PlayingCardT[];
  };
};

export type ClearAccessedCardsAction = {
  type: typeof CLEAR_ACCESSED_CARDS;
};

export type AddIceAction = {
  type: typeof INSTALL_ICE;
  payload: {
    ice: IcePlayingCardT;
  };
};

export type ModifyTagsAction = {
  type: typeof MODIFY_TAGS;
  payload: number;
};

export type IncrementVictoryPointsAction = {
  type: typeof INCREMENT_VICTORY_POINTS;
  payload: number;
};

export type GameAction =
  | SetPhase
  | RemoveFromHandAction
  | DrawCardsAction
  | DiscardHandAction
  | PlayCardAction
  | AddToTrashAction
  | AddToDiscardAction
  | AddToProgramsAction
  | IncrementSecurityAction
  | DecrementSecurityAction
  | ModifySecurityAction
  | SetTicksAction
  | ModifyClicksAction
  | IncrementTurnAction
  | AddToAccessedCardsAction
  | ClearAccessedCardsAction
  | AddIceAction
  | ModifyTagsAction
  | IncrementVictoryPointsAction;
