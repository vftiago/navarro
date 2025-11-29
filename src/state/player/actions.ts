import {
  AgendaPlayingCard,
  PlayingCard,
  ProgramPlayingCard,
} from "../../cardDefinitions/card";
import { PlayerAction, PlayerActionTypes } from "./types";

export const drawCards = (count: number): PlayerAction => ({
  payload: { count },
  type: PlayerActionTypes.DRAW_CARDS,
});

export const discardHand = (): PlayerAction => ({
  type: PlayerActionTypes.DISCARD_HAND,
});

export const addToPrograms = (card: ProgramPlayingCard): PlayerAction => ({
  payload: { card },
  type: PlayerActionTypes.ADD_TO_PROGRAMS,
});

export const addToDiscard = (card: PlayingCard): PlayerAction => ({
  payload: { card },
  type: PlayerActionTypes.ADD_TO_DISCARD,
});

export const addToTrash = (card: PlayingCard): PlayerAction => ({
  payload: { card },
  type: PlayerActionTypes.ADD_TO_TRASH,
});

export const addToScoreArea = (card: AgendaPlayingCard): PlayerAction => ({
  payload: { card },
  type: PlayerActionTypes.ADD_TO_SCORE_AREA,
});

export const addToAccessedCards = (cards: PlayingCard[]): PlayerAction => ({
  payload: { cards },
  type: PlayerActionTypes.ADD_TO_ACCESSED_CARDS,
});

export const clearAccessedCards = (): PlayerAction => ({
  type: PlayerActionTypes.CLEAR_ACCESSED_CARDS,
});

export const clearPlayedCards = (): PlayerAction => ({
  type: PlayerActionTypes.CLEAR_PLAYED_CARDS,
});

export const removeCardFromHand = (index: number): PlayerAction => ({
  payload: index,
  type: PlayerActionTypes.REMOVE_CARD_FROM_HAND,
});

export const addCardToPlayed = (card: PlayingCard): PlayerAction => ({
  payload: { card },
  type: PlayerActionTypes.ADD_TO_PLAYED,
});

export const removeRandomCardFromHand = (): PlayerAction => ({
  type: PlayerActionTypes.REMOVE_RANDOM_CARD_FROM_HAND,
});

export const modifyPlayerTags = (tags: number): PlayerAction => ({
  payload: tags,
  type: PlayerActionTypes.MODIFY_TAGS,
});

export const modifyPlayerNoise = (noise: number): PlayerAction => ({
  payload: noise,
  type: PlayerActionTypes.MODIFY_NOISE,
});

export const modifyPlayerSignal = (signal: number): PlayerAction => ({
  payload: signal,
  type: PlayerActionTypes.MODIFY_SIGNAL,
});

export const modifyPlayerVictoryPoints = (points: number): PlayerAction => ({
  payload: points,
  type: PlayerActionTypes.MODIFY_VICTORY_POINTS,
});
