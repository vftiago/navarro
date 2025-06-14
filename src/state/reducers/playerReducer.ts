import {
  AgendaPlayingCard,
  PlayingCard,
  ProgramPlayingCard,
} from "../../cardDefinitions/card";
import { playerStarterDeck } from "../../decks/playerStarterDeck";

import {
  discardHand as discardHandUtil,
  drawCardsFromDeck,
  shuffleCards,
} from "../utils";

export type PlayerState = {
  playerDeck: PlayingCard[];
  playerHand: PlayingCard[];
  playerPlayedCardS: PlayingCard[];
  playerDiscardPile: PlayingCard[];
  playerTrashPile: PlayingCard[];
  playerInstalledPrograms: ProgramPlayingCard[];
  playerAccessedCards: PlayingCard[];
  playerScoreArea: PlayingCard[];
  playerMaxHandSize: number;
  playerCardsPerTurn: number;
  playerClicksPerTurn: number;
  playerTags: number;
  playerVictoryPoints: number;
};

const shuffledDeck = shuffleCards([...playerStarterDeck]);

export const initialPlayerState: PlayerState = {
  playerDeck: shuffledDeck,
  playerHand: [],
  playerPlayedCardS: [],
  playerDiscardPile: [],
  playerTrashPile: [],
  playerInstalledPrograms: [],
  playerAccessedCards: [],
  playerTags: 0,
  playerVictoryPoints: 0,
  playerMaxHandSize: 10,
  playerCardsPerTurn: 5,
  playerClicksPerTurn: 3,
  playerScoreArea: [],
};

export enum PlayerActionTypes {
  DRAW_CARDS = "DRAW_CARDS",
  DISCARD_HAND = "DISCARD_HAND",
  ADD_TO_PLAYED = "ADD_TO_PLAYED",
  ADD_TO_PROGRAMS = "ADD_TO_PROGRAMS",
  ADD_TO_DISCARD = "ADD_TO_DISCARD",
  ADD_TO_TRASH = "ADD_TO_TRASH",
  ADD_TO_SCORE_AREA = "ADD_TO_SCORE_AREA",
  ADD_TO_ACCESSED_CARDS = "ADD_TO_ACCESSED_CARDS",
  CLEAR_ACCESSED_CARDS = "CLEAR_ACCESSED_CARDS",
  CLEAR_PLAYED_CARDS = "CLEAR_PLAYED_CARDS",
  REMOVE_CARD_FROM_HAND = "REMOVE_CARD_FROM_HAND",
  REMOVE_RANDOM_CARD_FROM_HAND = "REMOVE_RANDOM_CARD_FROM_HAND",
  MODIFY_TAGS = "MODIFY_TAGS",
  MODIFY_VICTORY_POINTS = "INCREMENT_VICTORY_POINTS",
}

export type PlayerAction =
  | { type: PlayerActionTypes.DRAW_CARDS; payload: { count: number } }
  | { type: PlayerActionTypes.DISCARD_HAND }
  | { type: PlayerActionTypes.ADD_TO_PLAYED; payload: { card: PlayingCard } }
  | {
      type: PlayerActionTypes.ADD_TO_PROGRAMS;
      payload: { card: ProgramPlayingCard };
    }
  | { type: PlayerActionTypes.ADD_TO_DISCARD; payload: { card: PlayingCard } }
  | { type: PlayerActionTypes.ADD_TO_TRASH; payload: { card: PlayingCard } }
  | {
      type: PlayerActionTypes.ADD_TO_SCORE_AREA;
      payload: { card: AgendaPlayingCard };
    }
  | {
      type: PlayerActionTypes.ADD_TO_ACCESSED_CARDS;
      payload: { cards: PlayingCard[] };
    }
  | { type: PlayerActionTypes.CLEAR_ACCESSED_CARDS }
  | { type: PlayerActionTypes.CLEAR_PLAYED_CARDS }
  | { type: PlayerActionTypes.REMOVE_CARD_FROM_HAND; payload: number }
  | { type: PlayerActionTypes.REMOVE_RANDOM_CARD_FROM_HAND }
  | { type: PlayerActionTypes.MODIFY_TAGS; payload: number }
  | { type: PlayerActionTypes.MODIFY_VICTORY_POINTS; payload: number };

// player actions
export const drawCards = (count: number): PlayerAction => ({
  type: PlayerActionTypes.DRAW_CARDS,
  payload: { count },
});

export const discardHand = (): PlayerAction => ({
  type: PlayerActionTypes.DISCARD_HAND,
});

export const addToPrograms = (card: ProgramPlayingCard): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_PROGRAMS,
  payload: { card },
});

export const addToDiscard = (card: PlayingCard): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_DISCARD,
  payload: { card },
});

export const addToTrash = (card: PlayingCard): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_TRASH,
  payload: { card },
});

export const addToScoreArea = (card: AgendaPlayingCard): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_SCORE_AREA,
  payload: { card },
});

export const addToAccessedCards = (cards: PlayingCard[]): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_ACCESSED_CARDS,
  payload: { cards },
});

export const clearAccessedCards = (): PlayerAction => ({
  type: PlayerActionTypes.CLEAR_ACCESSED_CARDS,
});

export const clearPlayedCards = (): PlayerAction => ({
  type: PlayerActionTypes.CLEAR_PLAYED_CARDS,
});

export const removeCardFromHand = (index: number): PlayerAction => ({
  type: PlayerActionTypes.REMOVE_CARD_FROM_HAND,
  payload: index,
});

export const addCardToPlayed = (card: PlayingCard): PlayerAction => ({
  type: PlayerActionTypes.ADD_TO_PLAYED,
  payload: { card },
});

export const removeRandomCardFromHand = (): PlayerAction => ({
  type: PlayerActionTypes.REMOVE_RANDOM_CARD_FROM_HAND,
});

export const modifyPlayerTags = (tags: number): PlayerAction => ({
  type: PlayerActionTypes.MODIFY_TAGS,
  payload: tags,
});

export const modifyPlayerVicotryPoints = (points: number): PlayerAction => ({
  type: PlayerActionTypes.MODIFY_VICTORY_POINTS,
  payload: points,
});

export const playerReducer = (
  state: PlayerState = initialPlayerState,
  action: PlayerAction,
): PlayerState => {
  switch (action.type) {
    case PlayerActionTypes.DRAW_CARDS: {
      const { count } = action.payload;

      const { newDeck, newHand, newDiscard } = drawCardsFromDeck({
        deck: state.playerDeck,
        hand: state.playerHand,
        discard: state.playerDiscardPile,
        count,
      });

      return {
        ...state,
        playerDeck: newDeck,
        playerHand: newHand,
        playerDiscardPile: newDiscard,
      };
    }

    case PlayerActionTypes.DISCARD_HAND: {
      const { newDiscard, newTrash } = discardHandUtil({
        hand: state.playerHand,
        discard: state.playerDiscardPile,
        trash: state.playerTrashPile,
      });

      return {
        ...state,
        playerHand: [],
        playerDiscardPile: newDiscard,
        playerTrashPile: newTrash,
      };
    }

    case PlayerActionTypes.REMOVE_CARD_FROM_HAND: {
      const newHand = state.playerHand.filter((_, i) => i !== action.payload);
      return {
        ...state,
        playerHand: newHand,
      };
    }

    case PlayerActionTypes.REMOVE_RANDOM_CARD_FROM_HAND: {
      const randomIndex = Math.floor(Math.random() * state.playerHand.length);
      const newHand = state.playerHand.filter((_, i) => i !== randomIndex);
      return {
        ...state,
        playerHand: newHand,
      };
    }

    case PlayerActionTypes.ADD_TO_PLAYED: {
      const { card } = action.payload;
      return {
        ...state,
        playerPlayedCardS: [...state.playerPlayedCardS, card],
      };
    }

    case PlayerActionTypes.ADD_TO_DISCARD: {
      const { card } = action.payload;
      return {
        ...state,
        playerDiscardPile: [...state.playerDiscardPile, card],
      };
    }

    case PlayerActionTypes.ADD_TO_TRASH: {
      const { card } = action.payload;
      return {
        ...state,
        playerTrashPile: [...state.playerTrashPile, card],
      };
    }

    case PlayerActionTypes.ADD_TO_PROGRAMS: {
      return {
        ...state,
        playerInstalledPrograms: [
          ...state.playerInstalledPrograms,
          action.payload.card,
        ],
      };
    }

    case PlayerActionTypes.ADD_TO_SCORE_AREA: {
      const { card } = action.payload;
      return {
        ...state,
        playerScoreArea: [...state.playerScoreArea, card],
      };
    }

    case PlayerActionTypes.ADD_TO_ACCESSED_CARDS: {
      const { cards } = action.payload;
      return {
        ...state,
        playerAccessedCards: [...state.playerAccessedCards, ...cards],
      };
    }

    case PlayerActionTypes.CLEAR_ACCESSED_CARDS: {
      return {
        ...state,
        playerAccessedCards: [],
      };
    }

    case PlayerActionTypes.CLEAR_PLAYED_CARDS: {
      return {
        ...state,
        playerPlayedCardS: [],
      };
    }

    case PlayerActionTypes.MODIFY_TAGS: {
      return {
        ...state,
        playerTags: Math.max(0, state.playerTags + action.payload),
      };
    }

    case PlayerActionTypes.MODIFY_VICTORY_POINTS: {
      return {
        ...state,
        playerVictoryPoints: state.playerVictoryPoints + action.payload,
      };
    }

    default:
      return state;
  }
};
