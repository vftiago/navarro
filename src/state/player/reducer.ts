import { playerStarterDeck } from "../../decks/playerStarterDeck";
import {
  discardHand as discardHandUtil,
  drawCardsFromDeck,
  shuffleCards,
} from "../utils";
import type { PlayerAction, PlayerState } from "./types";
import { PlayerActionTypes } from "./types";

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
  playerSignal: 10,
  playerTags: 0,
  playerTrashPile: [],
  playerVictoryPoints: 0,
};

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

    case PlayerActionTypes.ADD_TO_DECK: {
      const { card } = action.payload;
      return {
        ...state,
        playerDeck: [...state.playerDeck, card],
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

    case PlayerActionTypes.MODIFY_NOISE: {
      return {
        ...state,
        playerNoise: Math.max(0, state.playerNoise + action.payload),
      };
    }

    case PlayerActionTypes.MODIFY_SIGNAL: {
      return {
        ...state,
        playerSignal: Math.max(0, state.playerSignal + action.payload),
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
