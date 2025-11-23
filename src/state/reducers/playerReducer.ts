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
  playerPlayedCards: PlayingCard[];
  playerDiscardPile: PlayingCard[];
  playerTrashPile: PlayingCard[];
  playerInstalledPrograms: ProgramPlayingCard[];
  playerAccessedCards: PlayingCard[];
  playerScoreArea: PlayingCard[];
  playerMaxHandSize: number;
  playerCardsPerTurn: number;
  playerClicksPerTurn: number;
  playerTags: number;
  playerNoise: number;
  playerSignal: number;
  playerMemory: number;
  playerVictoryPoints: number;
};

const shuffledDeck = shuffleCards([...playerStarterDeck]);

export const initialPlayerState: PlayerState = {
  playerAccessedCards: [],
  playerCardsPerTurn: 5,
  playerClicksPerTurn: 3,
  playerDeck: shuffledDeck,
  playerDiscardPile: [],
  playerHand: [],
  playerInstalledPrograms: [],
  playerMaxHandSize: 10,
  playerMemory: 4,
  playerNoise: 0,
  playerPlayedCards: [],
  playerScoreArea: [],
  playerSignal: 0,
  playerTags: 0,
  playerTrashPile: [],
  playerVictoryPoints: 0,
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
  MODIFY_NOISE = "MODIFY_NOISE",
  MODIFY_SIGNAL = "MODIFY_SIGNAL",
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
  | { type: PlayerActionTypes.MODIFY_NOISE; payload: number }
  | { type: PlayerActionTypes.MODIFY_SIGNAL; payload: number }
  | { type: PlayerActionTypes.MODIFY_VICTORY_POINTS; payload: number };

// player actions
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

export const playerReducer = (
  state: PlayerState = initialPlayerState,
  action: PlayerAction,
): PlayerState => {
  switch (action.type) {
    case PlayerActionTypes.DRAW_CARDS: {
      const { count } = action.payload;

      const { newDeck, newDiscard, newHand } = drawCardsFromDeck({
        count,
        deck: state.playerDeck,
        discard: state.playerDiscardPile,
        hand: state.playerHand,
      });

      return {
        ...state,
        playerDeck: newDeck,
        playerDiscardPile: newDiscard,
        playerHand: newHand,
      };
    }

    case PlayerActionTypes.DISCARD_HAND: {
      const { newDiscard, newTrash } = discardHandUtil({
        discard: state.playerDiscardPile,
        hand: state.playerHand,
        trash: state.playerTrashPile,
      });

      return {
        ...state,
        playerDiscardPile: newDiscard,
        playerHand: [],
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
        playerPlayedCards: [...state.playerPlayedCards, card],
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
        playerPlayedCards: [],
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
