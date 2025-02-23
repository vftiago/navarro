import arrayShuffle from "array-shuffle";
import { Keyword, PlayingCardT, TriggerMoment } from "./cards/card";
import { playerStarterDeck } from "./decks/playerStarterDeck";
import { applyEffects, shuffle } from "./utils";
import { serverICEDeck, serverStarterDeck } from "./decks/serverStarterDeck";

export enum GamePhase {
  Draw = "Draw", // Drawing new cards
  Main = "Main", // Player can play cards
  Discard = "Discard", // Cards are being discarded
  End = "End", // End of turn
}

export type GameState = {
  currentPhase: GamePhase;
  securityLevel: number;
  turn: number;
  tick: number;
  animationKey: number;
  shouldDiscard: boolean;
  player: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
    hand: PlayingCardT[];
    discard: PlayingCardT[];
    trash: PlayingCardT[];
    score: PlayingCardT[];
    handSize: number;
    ticksPerTurn: number;
    tags: number;
    victoryPoints: number;
    programs: PlayingCardT[];
  };
  server: {
    deck: PlayingCardT[];
    currentDeck: PlayingCardT[];
    ice: PlayingCardT[];
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
      type: "endPhase";
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

  const newState = {
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

  const combinedPlayerEffects = state.player.hand
    .map((card) => card.cardEffects)
    .flat();

  const stateAfterDrawEffects = applyEffects(
    newState,
    combinedPlayerEffects,
    TriggerMoment.ON_DRAW,
  );

  const combinedIceEffects = state.server.ice
    .map((card) => card.cardEffects)
    .flat();

  const stateAfterIceEffects = applyEffects(
    stateAfterDrawEffects,
    combinedIceEffects,
    TriggerMoment.ON_TURN_START,
  );

  return stateAfterIceEffects;
};

const applyDiscard = (state: GameState) => {
  const newTrash = [...state.player.trash];

  const newDiscard = [...state.player.discard];

  for (let i = 0; i < state.player.hand.length; i++) {
    const card = state.player.hand[i];

    const shouldTrash = card.cardEffects?.some(
      (effect) => effect.keyword === Keyword.TRASH,
    );

    if (shouldTrash) {
      newTrash.unshift(card);
    } else {
      newDiscard.unshift(card);
    }
  }

  return {
    ...state,
    animationKey: state.animationKey + 1,
    currentPhase: GamePhase.Discard,
    player: {
      ...state.player,
      hand: [],
      discard: newDiscard,
      trash: newTrash,
    },
  };
};

const applyEndPhase = (state: GameState) => {
  const rezzedIce = serverICEDeck.pop();

  return {
    ...state,
    currentPhase: GamePhase.End,
    server: {
      ...state.server,
      ice: rezzedIce ? [...state.server.ice, rezzedIce] : state.server.ice,
    },
  };
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

      const stateAfterEffects = applyEffects(
        state,
        card.cardEffects,
        TriggerMoment.ON_PLAY,
      );

      const shouldTrash = card.cardEffects?.some(
        (effect) => effect.keyword === Keyword.TRASH,
      );

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
        shouldDiscard: newTick <= 0,
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

    case "endPhase": {
      return applyEndPhase(state);
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
  shouldDiscard: false,
  player: {
    deck: initialPlayerDeck,
    currentDeck: initialPlayerDeck,
    hand: initialPlayerDeck.splice(0, initialHandSize),
    discard: [],
    trash: [],
    score: [],
    handSize: initialHandSize,
    ticksPerTurn: initialTicksPerTurn,
    tags: 0,
    victoryPoints: 0,
    programs: [],
  },
  server: {
    deck: initialServerDeck,
    currentDeck: initialServerDeck,
    ice: [],
  },
  fetchedCards: [],
};
