import arrayShuffle from "array-shuffle";
import { CardT } from "./cards/cards";
import { starterDeck as playerStarterDeck } from "./decks/playerDecks/starterDeck";
import { shuffle } from "./gameUtils";

export type GameState = {
  securityLevel: number;
  turn: number;
  tick: number;
  player: {
    deck: CardT[];
    currentDeck: CardT[];
    hand: CardT[];
    discard: CardT[];
    handSize: number;
    ticksPerTurn: number;
  };
};

export type GameAction =
  | {
      type: "endTurn";
    }
  | {
      type: "playCard";
      card: CardT;
      index: number;
    };

const endTurn = (state: GameState) => {
  const currentDiscard = [...state.player.discard, ...state.player.hand];
  const currentHandSize = state.player.handSize;

  let currentDeck = [...state.player.currentDeck];
  let newHand: CardT[] = [];

  while (newHand.length < currentHandSize) {
    if (currentDeck.length === 0) {
      currentDeck = shuffle(currentDiscard);
      currentDiscard.length = 0;
    }

    const drawCount = Math.min(
      currentHandSize - newHand.length,
      currentDeck.length,
    );

    newHand = newHand.concat(currentDeck.slice(0, drawCount));
    currentDeck = currentDeck.slice(drawCount);
  }

  return {
    ...state,
    player: {
      ...state.player,
      hand: newHand,
      currentDeck,
      discard: currentDiscard,
    },
    securityLevel: state.securityLevel + 1,
    turn: state.turn + 1,
    tick: state.player.ticksPerTurn,
  };
};

export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "playCard": {
      const card = action.card;
      const cardIndex = action.index;
      const newHand = state.player.hand.filter(
        (card, index) => index !== cardIndex,
      );

      card.effects.forEach((effect) => {
        effect.callback?.(state);
      });

      const newDiscard = [...state.player.discard, card];

      const newTick = state.tick - 1;

      if (newTick === 0) {
        return endTurn(state);
      }

      return {
        ...state,
        tick: newTick,
        player: {
          ...state.player,
          hand: newHand,
          discard: newDiscard,
        },
        isNewTurn: false,
      };
    }

    case "endTurn": {
      return endTurn(state);
    }

    default:
      return state;
  }
};

const initialDeck = arrayShuffle(playerStarterDeck);

const initialHandSize = 5;

const initialTicksPerTurn = 3;

export const initialGameState: GameState = {
  securityLevel: 1,
  turn: 1,
  tick: 3,
  player: {
    deck: initialDeck,
    currentDeck: initialDeck,
    hand: initialDeck.splice(0, initialHandSize),
    discard: [],
    handSize: initialHandSize,
    ticksPerTurn: initialTicksPerTurn,
  },
};
