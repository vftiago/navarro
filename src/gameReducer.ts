import arrayShuffle from "array-shuffle";
import {
  CardEffectT,
  CardType,
  Keyword,
  PlayingCardT,
  TriggerMoment,
} from "./cards/card";
import { playerStarterDeck } from "./decks/playerStarterDeck";
import { applyEffects, shuffle } from "./utils";
import {
  serverStarterDeck,
  weightedServerCards,
  weightedServerICEDeck,
} from "./decks/serverStarterDeck";

export enum GamePhase {
  Draw = "Draw", // Drawing new cards
  Main = "Main", // Player can play cards
  Play = "Play", // Player is playing a card
  Resolve = "Resolve", // Resolving card effects
  Access = "Access", // Player is accessing server cards
  Fetch = "Fetch", // Player is fetching server cards
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
  nextAction: null | GameAction;
  player: {
    cardInPlay?: PlayingCardT;
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
  accessedCards: PlayingCardT[];
};

export type GameAction =
  | {
      type: GamePhase.Draw;
    }
  | {
      type: GamePhase.Discard;
    }
  | {
      type: GamePhase.Main;
    }
  | {
      type: GamePhase.Play;
      card: PlayingCardT;
      index: number;
    }
  | {
      type: GamePhase.Resolve;
    }
  | {
      type: GamePhase.Access;
    }
  | {
      type: GamePhase.Fetch;
      card: PlayingCardT;
    }
  | {
      type: GamePhase.End;
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

  const nextAction = { type: GamePhase.Main } as const;

  const newState = {
    ...state,
    animationKey: state.animationKey + 1,
    currentPhase: GamePhase.Draw,
    nextAction,
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

  const nextAction = { type: GamePhase.End } as const;

  return {
    ...state,
    animationKey: state.animationKey + 1,
    currentPhase: GamePhase.Discard,
    nextAction,
    player: {
      ...state.player,
      hand: [],
      discard: newDiscard,
      trash: newTrash,
    },
  };
};

const applyMainPhase = (gameState: GameState) => {
  return {
    ...gameState,
    nextAction: null,
    currentPhase: GamePhase.Main,
  };
};

const applyPlayPhase = (
  gameState: GameState,
  card: PlayingCardT,
  cardIndex: number,
) => {
  const stateAfterEffects = applyEffects(
    gameState,
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

  const newHand = stateAfterEffects.player.hand.filter(
    (_card, index) => index !== cardIndex,
  );

  const newTick = stateAfterEffects.tick - 1;

  return {
    ...stateAfterEffects,
    currentPhase: GamePhase.Play,
    nextAction: stateAfterEffects.nextAction ?? {
      type: GamePhase.Resolve,
    },
    tick: newTick,
    player: {
      ...stateAfterEffects.player,
      hand: newHand,
      discard: newDiscard,
      trash: newTrash,
      cardInPlay: card,
    },
  };
};

const applyAccessPhase = (gameState: GameState) => {
  const combinedIceEffects = gameState.server.ice.reduce(
    (acc, ice) => [...acc, ...ice.cardEffects],
    [] as CardEffectT[],
  );

  const stateAfterOnAccessEffects = applyEffects(
    gameState,
    combinedIceEffects,
    TriggerMoment.ON_ACCESS,
  );

  const randomServerCard = weightedServerCards.pick();

  const newServerCurrentDeck = gameState.server.currentDeck.filter(
    (card) => card.id !== randomServerCard.id,
  );

  const newAccessedCards = [...gameState.accessedCards];

  newAccessedCards.push(randomServerCard);

  const nextAction = {
    type: GamePhase.Fetch,
    card: randomServerCard,
  } as const;

  return {
    ...stateAfterOnAccessEffects,
    currentPhase: GamePhase.Access,
    nextAction,
    accessedCards: newAccessedCards,
    server: {
      ...stateAfterOnAccessEffects.server,
      currentDeck: newServerCurrentDeck,
    },
  };
};

const applyFetchPhase = (
  gameState: GameState,
  card: PlayingCardT,
): GameState => {
  const stateAfterOnFetchEffects = applyEffects(
    gameState,
    card.cardEffects,
    TriggerMoment.ON_FETCH,
  );

  const isFile = card.type === CardType.FILE;

  const isAgenda = card.type === CardType.AGENDA;

  const newDiscard = isFile
    ? [...stateAfterOnFetchEffects.player.discard, card]
    : stateAfterOnFetchEffects.player.discard;

  const newScore = isAgenda
    ? [...stateAfterOnFetchEffects.player.score, card]
    : stateAfterOnFetchEffects.player.score;

  const nextAction = { type: GamePhase.Resolve } as const;

  return {
    ...stateAfterOnFetchEffects,
    currentPhase: GamePhase.Fetch,
    nextAction,
    player: {
      ...stateAfterOnFetchEffects.player,
      discard: newDiscard,
      score: newScore,
    },
    accessedCards: [],
  };
};

const applyResolvePhase = (gameState: GameState) => {
  const currentTick = gameState.tick;

  const nextAction =
    currentTick === 0
      ? ({ type: GamePhase.Discard } as const)
      : ({ type: GamePhase.Main } as const);

  return {
    ...gameState,
    currentPhase: GamePhase.Resolve,
    nextAction,
  };
};

const applyEndPhase = (state: GameState) => {
  const rezzedIce = weightedServerICEDeck.pick();

  const nextAction = { type: GamePhase.Draw } as const;

  return {
    ...state,
    currentPhase: GamePhase.End,
    nextAction,
    server: {
      ...state.server,
      ice: rezzedIce ? [...state.server.ice, rezzedIce] : state.server.ice,
    },
  };
};

export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case GamePhase.Main: {
      return applyMainPhase(state);
    }

    case GamePhase.Play: {
      const { card, index } = action;

      return applyPlayPhase(state, card, index);
    }

    case GamePhase.Access: {
      return applyAccessPhase(state);
    }

    case GamePhase.Fetch: {
      const { card } = action;

      return applyFetchPhase(state, card);
    }

    case GamePhase.Resolve: {
      return applyResolvePhase(state);
    }

    case GamePhase.Discard: {
      return applyDiscard(state);
    }

    case GamePhase.End: {
      return applyEndPhase(state);
    }

    case GamePhase.Draw: {
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
  nextAction: { type: GamePhase.Main },
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
  accessedCards: [],
};
