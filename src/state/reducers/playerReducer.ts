import { playerStarterDeck } from "../../decks/playerStarterDeck";
import {
  GameAction,
  PlayerState,
  DRAW_CARDS,
  DISCARD_HAND,
  PLAY_CARD,
  ADD_TO_PROGRAMS,
  MODIFY_TAGS,
  INCREMENT_VICTORY_POINTS,
  REMOVE_FROM_HAND,
  ADD_TO_DISCARD,
  ADD_TO_TRASH,
} from "../types";
import {
  discardHand,
  drawCardsFromDeck,
  playCardFromHand,
  shuffleCards,
} from "../utils/cardUtils";

const initialDeck = shuffleCards(playerStarterDeck.slice(5));

export const initialPlayerState: PlayerState = {
  playerDeck: initialDeck,
  playerHand: [],
  playerPlayedCard: [],
  playerDiscardPile: [],
  playerTrashPile: [],
  playerInstalledPrograms: [],
  playerTags: 0,
  playerVictoryPoints: 0,
  playerMaxHandSize: 10,
  playerCardsPerTurn: 5,
  playerClicksPerTurn: 1,
  playerScoreArea: [],
};

export const playerReducer = (
  state: PlayerState = initialPlayerState,
  action: GameAction,
): PlayerState => {
  switch (action.type) {
    case DRAW_CARDS: {
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

    case DISCARD_HAND: {
      const { newDiscard, newTrash } = discardHand({
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

    case PLAY_CARD: {
      const { card, index } = action.payload;
      const { newHand, newDiscard, newTrash, newPrograms, newPlayedCard } =
        playCardFromHand({
          hand: state.playerHand,
          discard: state.playerDiscardPile,
          trash: state.playerTrashPile,
          programs: state.playerInstalledPrograms,
          card,
          cardIndex: index,
        });

      return {
        ...state,
        playerHand: newHand,
        playerDiscardPile: newDiscard,
        playerTrashPile: newTrash,
        playerInstalledPrograms: newPrograms,
        playerPlayedCard: newPlayedCard,
      };
    }

    case REMOVE_FROM_HAND: {
      const { index } = action.payload;
      const newHand = state.playerHand.filter((_, i) => i !== index);
      return {
        ...state,
        playerHand: newHand,
      };
    }

    case ADD_TO_DISCARD: {
      const { card } = action.payload;
      return {
        ...state,
        playerDiscardPile: [...state.playerDiscardPile, card],
      };
    }

    case ADD_TO_TRASH: {
      const { card } = action.payload;
      return {
        ...state,
        playerTrashPile: [...state.playerTrashPile, card],
      };
    }

    case ADD_TO_PROGRAMS: {
      return {
        ...state,
        playerInstalledPrograms: [
          ...state.playerInstalledPrograms,
          action.payload.card,
        ],
      };
    }

    case MODIFY_TAGS: {
      return {
        ...state,
        playerTags: Math.max(0, state.playerTags + action.payload),
      };
    }

    case INCREMENT_VICTORY_POINTS: {
      return {
        ...state,
        playerVictoryPoints: state.playerVictoryPoints + action.payload,
      };
    }

    default:
      return state;
  }
};
