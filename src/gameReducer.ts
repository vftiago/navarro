import arrayShuffle from "array-shuffle";
import { CardKeywordT, PlayingCardT } from "./cards/cards";
import { playerStarterDeck } from "./decks/playerDecks/starterDeck";
import { shuffle } from "./gameUtils";
import { serverStarterDeck } from "./decks/serverDecks/starterDeck";

export enum GamePhase {
  Draw = "Draw", // Drawing new cards
  Main = "Main", // Player can play cards
  Discard = "Discard", // Cards are being discarded
}

export type GameState = {
  currentPhase: GamePhase;
  securityLevel: number;
  turn: number;
  tick: number;
  animationKey: number;
  player: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
    hand: PlayingCardT[];
    discard: PlayingCardT[];
    trash: PlayingCardT[];
    handSize: number;
    ticksPerTurn: number;
    tags: number;
  };
  server: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
  };
  fetchedCards: PlayingCardT[];
};

export type GameAction =
  | {
      type: "drawPhase";
    }
  | {
      type: "discardPhase";
    }
  | {
      type: "mainPhase";
      card?: PlayingCardT;
      index?: number;
    }
  | {
      type: "phaseComplete";
    };

const applyDraw = (state: GameState) => {
  const currentHandSize = state.player.handSize;

  const currentDiscard = [...state.player.discard];

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

  const newDeck = currentDeck;

  return {
    ...state,
    animationKey: state.animationKey + 1,
    currentPhase: GamePhase.Draw,
    player: {
      ...state.player,
      hand: newHand,
      currentDeck: newDeck,
      discard: currentDiscard,
    },
    securityLevel: state.securityLevel + 1,
    turn: state.turn + 1,
    tick: state.player.ticksPerTurn,
  };
};

const applyDiscard = (state: GameState) => {
  const newTrash = [...state.player.trash];

  const newDiscard = [...state.player.discard];

  for (let i = 0; i < state.player.hand.length; i++) {
    const card = state.player.hand[i];

    const shouldTrash = card.keywords?.includes(CardKeywordT.ETHEREAL);

    if (shouldTrash) {
      newTrash.push(card);
    } else {
      newDiscard.push(card);
    }
  }

  return {
    ...state,
    animationKey: state.animationKey + 1,
    currentPhase: GamePhase.Discard,
    tick: -1,
    player: {
      ...state.player,
      hand: [],
      discard: newDiscard,
      trash: newTrash,
    },
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
    case "mainPhase": {
      if (!action.card || action.index === undefined) {
        return {
          ...state,
          currentPhase: GamePhase.Main,
        };
      }

      const card = action.card;
      const cardIndex = action.index;
      const newHand = state.player.hand.filter(
        (_card, index) => index !== cardIndex,
      );

      card.effects?.forEach((effect) => {
        effect.callback?.(state);
      });

      const stateAfterEffects = applyEffects(state, card.effects);

      const shouldTrash = card.keywords?.includes(CardKeywordT.TRASH);

      const newTrash = [...stateAfterEffects.player.trash];

      const newDiscard = [...stateAfterEffects.player.discard];

      if (shouldTrash) {
        newTrash.push(card);
      } else {
        newDiscard.push(card);
      }

      const newTick = stateAfterEffects.tick - 1;

      return {
        ...stateAfterEffects,
        currentPhase: GamePhase.Main,
        tick: newTick,
        player: {
          ...stateAfterEffects.player,
          hand: newHand,
          discard: newDiscard,
          trash: newTrash,
        },
      };
    }

    case "discardPhase": {
      return applyDiscard(state);
    }

    case "drawPhase": {
      return applyDraw(state);
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
  currentPhase: GamePhase.Draw,
  animationKey: 0,
  player: {
    deck: initialPlayerDeck,
    currentDeck: initialPlayerDeck,
    hand: initialPlayerDeck.splice(0, initialHandSize),
    discard: [],
    trash: [],
    handSize: initialHandSize,
    ticksPerTurn: initialTicksPerTurn,
    tags: 0,
  },
  server: {
    deck: initialServerDeck,
    currentDeck: initialServerDeck,
  },
  fetchedCards: [],
};
