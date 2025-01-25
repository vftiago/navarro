import arrayShuffle from "array-shuffle";
import { PlayingCardT } from "./cards/cards";
import { playerStarterDeck } from "./decks/playerDecks/starterDeck";
import { shuffle } from "./gameUtils";
import { serverStarterDeck } from "./decks/serverDecks/starterDeck";

export type GameState = {
  securityLevel: number;
  turn: number;
  tick: number;
  player: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
    hand: PlayingCardT[];
    discard: PlayingCardT[];
    handSize: number;
    ticksPerTurn: number;
  };
  server: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
  };
};

export type GameAction =
  | {
      type: "endTurn";
    }
  | {
      type: "playCard";
      card: PlayingCardT;
      index: number;
    };

const endTurn = (state: GameState) => {
  const currentDiscard = [...state.player.discard, ...state.player.hand];
  const currentHandSize = state.player.handSize;

  let currentDeck = [...state.player.currentDeck];
  let newHand: PlayingCardT[] = [];

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

const applyEffects = (
  initialGameState: GameState,
  cardEffects: PlayingCardT["effects"],
): GameState => {
  return cardEffects
    ? cardEffects.reduce((currentState, effect) => {
        return effect.callback(currentState);
      }, initialGameState)
    : initialGameState;
};

export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "playCard": {
      const card = action.card;
      const cardIndex = action.index;
      const newHand = state.player.hand.filter(
        (_card, index) => index !== cardIndex,
      );

      card.effects?.forEach((effect) => {
        effect.callback?.(state);
      });

      const stateAfterEffects = applyEffects(state, card.effects);

      const newDiscard = [...stateAfterEffects.player.discard, card];

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

const initialPlayerDeck = arrayShuffle(playerStarterDeck);

const initialServerDeck = arrayShuffle(serverStarterDeck);

const initialHandSize = 5;

const initialTicksPerTurn = 3;

export const initialGameState: GameState = {
  securityLevel: 1,
  turn: 1,
  tick: 3,
  player: {
    deck: initialPlayerDeck,
    currentDeck: initialPlayerDeck,
    hand: initialPlayerDeck.splice(0, initialHandSize),
    discard: [],
    handSize: initialHandSize,
    ticksPerTurn: initialTicksPerTurn,
  },
  server: {
    deck: initialServerDeck,
    currentDeck: initialServerDeck,
  },
};
