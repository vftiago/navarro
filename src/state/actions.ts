import { IcePlayingCardT, PlayingCardT } from "../cards/card";
import {
  GameAction,
  DISCARD_PHASE,
  MAIN_PHASE,
  PLAY_PHASE,
  RESOLVE_PHASE,
  ACCESS_PHASE,
  FETCH_PHASE,
  END_PHASE,
  CORP_PHASE,
  DRAW_CARDS,
  DISCARD_HAND,
  PLAY_CARD,
  ADD_TO_PROGRAMS,
  INCREMENT_SECURITY,
  DECREMENT_SECURITY,
  SET_CLICKS,
  MODIFY_CLICKS,
  INCREMENT_TURN,
  ADD_TO_ACCESSED_CARDS,
  CLEAR_ACCESSED_CARDS,
  INSTALL_ICE as ADD_TO_ICE,
  MODIFY_TAGS,
  INCREMENT_VICTORY_POINTS,
  MODIFY_SECURITY,
  ADD_TO_TRASH,
  ADD_TO_DISCARD,
  REMOVE_FROM_HAND,
  SET_PHASE,
  GamePhase,
} from "./types";

// Phase transitions
export const setPhase = (nextPhase: GamePhase): GameAction => ({
  type: SET_PHASE,
  payload: nextPhase,
});

export const discardPhase = (): GameAction => ({
  type: DISCARD_PHASE,
});

export const mainPhase = (): GameAction => ({
  type: MAIN_PHASE,
});

export const playPhase = (card: PlayingCardT, index: number): GameAction => ({
  type: PLAY_PHASE,
  payload: {
    card,
    index,
  },
});

export const resolvePhase = (): GameAction => ({
  type: RESOLVE_PHASE,
});

export const accessPhase = (cardCount: number = 1): GameAction => ({
  type: ACCESS_PHASE,
  payload: {
    cardCount,
  },
});

export const fetchPhase = (card: PlayingCardT): GameAction => ({
  type: FETCH_PHASE,
  payload: {
    card,
  },
});

export const endPhase = (): GameAction => ({
  type: END_PHASE,
});

export const corpPhase = (): GameAction => ({
  type: CORP_PHASE,
});

// Game state actions
export const setClicks = (ticks: number): GameAction => ({
  type: SET_CLICKS,
  payload: ticks,
});

export const modifyClicks = (amount: number): GameAction => ({
  type: MODIFY_CLICKS,
  payload: amount,
});

export const incrementTurn = (): GameAction => ({
  type: INCREMENT_TURN,
});

// Player actions
export const drawCards = (count: number): GameAction => ({
  type: DRAW_CARDS,
  payload: {
    count,
  },
});

export const discardHand = (): GameAction => ({
  type: DISCARD_HAND,
});

export const addToTrash = (card: PlayingCardT): GameAction => ({
  type: ADD_TO_TRASH,
  payload: {
    card,
  },
});
export const addToDiscard = (card: PlayingCardT): GameAction => ({
  type: ADD_TO_DISCARD,
  payload: {
    card,
  },
});

export const removeCardFromHand = (index: number): GameAction => ({
  type: REMOVE_FROM_HAND,
  payload: {
    index,
  },
});

export const playCard = (card: PlayingCardT, index: number): GameAction => ({
  type: PLAY_CARD,
  payload: {
    card,
    index,
  },
});

export const addToPrograms = (card: PlayingCardT): GameAction => ({
  type: ADD_TO_PROGRAMS,
  payload: {
    card,
  },
});

export const modifyTags = (amount: number): GameAction => ({
  type: MODIFY_TAGS,
  payload: amount,
});

export const incrementVictoryPoints = (amount: number): GameAction => ({
  type: INCREMENT_VICTORY_POINTS,
  payload: amount,
});

// Server actions
export const addToIce = (ice: IcePlayingCardT): GameAction => ({
  type: ADD_TO_ICE,
  payload: {
    ice,
  },
});

export const incrementSecurity = (): GameAction => ({
  type: INCREMENT_SECURITY,
});

export const decrementSecurity = (): GameAction => ({
  type: DECREMENT_SECURITY,
});

export const modifySecurity = (amount: number): GameAction => ({
  type: MODIFY_SECURITY,
  payload: amount,
});

// Accessed cards actions
export const addToAccessedCards = (cards: PlayingCardT[]): GameAction => ({
  type: ADD_TO_ACCESSED_CARDS,
  payload: {
    cards,
  },
});

export const clearAccessedCards = (): GameAction => ({
  type: CLEAR_ACCESSED_CARDS,
});
