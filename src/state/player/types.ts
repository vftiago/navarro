import type { CardInstance } from "../../cards/instance";

export type PlayerState = {
  playerDeck: CardInstance[];
  playerHand: CardInstance[];
  playerPlayedCards: CardInstance[];
  playerDiscardPile: CardInstance[];
  playerTrashPile: CardInstance[];
  playerInstalledPrograms: CardInstance[];
  playerAccessedCards: CardInstance[];
  playerScoreArea: CardInstance[];
  playerMaxHandSize: number;
  playerCardsPerTurn: number;
  playerClicksPerTurn: number;
  playerTags: number;
  playerNoise: number;
  playerSignal: number;
  playerMemory: number;
  playerVictoryPoints: number;
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
  ADD_TO_DECK = "ADD_TO_DECK",
  CLEAR_ACCESSED_CARDS = "CLEAR_ACCESSED_CARDS",
  CLEAR_PLAYED_CARDS = "CLEAR_PLAYED_CARDS",
  REMOVE_CARD_FROM_HAND = "REMOVE_CARD_FROM_HAND",
  REMOVE_FROM_PROGRAMS = "REMOVE_FROM_PROGRAMS",
  REMOVE_RANDOM_CARD_FROM_HAND = "REMOVE_RANDOM_CARD_FROM_HAND",
  MODIFY_TAGS = "MODIFY_TAGS",
  MODIFY_NOISE = "MODIFY_NOISE",
  MODIFY_SIGNAL = "MODIFY_SIGNAL",
  MODIFY_VICTORY_POINTS = "INCREMENT_VICTORY_POINTS",
}

export type PlayerAction =
  | { type: PlayerActionTypes.DRAW_CARDS; payload: { count: number } }
  | { type: PlayerActionTypes.DISCARD_HAND }
  | { type: PlayerActionTypes.ADD_TO_PLAYED; payload: { card: CardInstance } }
  | {
      type: PlayerActionTypes.ADD_TO_PROGRAMS;
      payload: { card: CardInstance };
    }
  | { type: PlayerActionTypes.ADD_TO_DISCARD; payload: { card: CardInstance } }
  | { type: PlayerActionTypes.ADD_TO_TRASH; payload: { card: CardInstance } }
  | {
      type: PlayerActionTypes.ADD_TO_SCORE_AREA;
      payload: { card: CardInstance };
    }
  | {
      type: PlayerActionTypes.ADD_TO_ACCESSED_CARDS;
      payload: { cards: CardInstance[] };
    }
  | { type: PlayerActionTypes.ADD_TO_DECK; payload: { card: CardInstance } }
  | { type: PlayerActionTypes.CLEAR_ACCESSED_CARDS }
  | { type: PlayerActionTypes.CLEAR_PLAYED_CARDS }
  | { type: PlayerActionTypes.REMOVE_CARD_FROM_HAND; payload: number }
  | {
      type: PlayerActionTypes.REMOVE_FROM_PROGRAMS;
      payload: { instanceId: string };
    }
  | { type: PlayerActionTypes.REMOVE_RANDOM_CARD_FROM_HAND }
  | { type: PlayerActionTypes.MODIFY_TAGS; payload: number }
  | { type: PlayerActionTypes.MODIFY_NOISE; payload: number }
  | { type: PlayerActionTypes.MODIFY_SIGNAL; payload: number }
  | { type: PlayerActionTypes.MODIFY_VICTORY_POINTS; payload: number };
