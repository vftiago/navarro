import {
  CardRarityT,
  CardPropertiesT,
  CardTypeT,
  CardKeywordT,
} from "../cards";
import { v4 as uuid } from "uuid";

export const playerCards: CardPropertiesT[] = [
  {
    id: uuid(),
    name: "Hack",
    image: "_f3938419-60f6-42a9-8294-f8a93e848cd7.jpeg",
    rarity: CardRarityT.BASIC,
    type: CardTypeT.ACTION,
    effects: [
      {
        callback: (gameState) => {
          const randomServerCard =
            gameState.server.currentDeck[
              Math.floor(Math.random() * gameState.server.currentDeck.length)
            ];

          const newGameState = {
            ...gameState,
            server: {
              ...gameState.server,
              currentDeck: gameState.server.currentDeck.filter(
                (card) => card.deckContextId !== randomServerCard.deckContextId,
              ),
            },
            player: {
              ...gameState.player,
              discard: [...gameState.player.discard, randomServerCard],
            },
            fetchedCards: [randomServerCard],
          };

          return newGameState;
        },
        description: {
          text: "Fetch 1 file.",
        },
      },
    ],
  },
  {
    id: uuid(),
    name: "Crack",
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    rarity: CardRarityT.BASIC,
    type: CardTypeT.ACTION,
    effects: [
      {
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            securityLevel: gameState.securityLevel - 1,
          };

          return newGameState;
        },
        description: {
          text: "Reduce the server security level by 1.",
        },
      },
    ],
  },
  {
    id: uuid(),
    name: "Net Block",
    image: "_d7d4c45d-e224-4ff1-956f-d58c6525535e.jpeg",
    rarity: CardRarityT.COMMON,
    type: CardTypeT.ACTION,
    effects: [
      {
        callback: (gameState) => gameState,
        description: {
          text: "Add 2 block.",
        },
      },
    ],
  },
  {
    id: uuid(),
    name: "Boost",
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    rarity: CardRarityT.RARE,
    type: CardTypeT.ACTION,
    keywords: [CardKeywordT.CRASH, CardKeywordT.TRASH],
    effects: [
      {
        callback: (gameState) => {
          return {
            ...gameState,
            tick: gameState.tick + 3,
          };
        },
        description: {
          text: "Gain 3 ticks.",
        },
      },
      {
        callback: (gameState) => gameState,
        description: {
          text: "Crash.",
          isKeyword: true,
        },
      },
      {
        callback: (gameState) => gameState,
        description: {
          text: "Trash.",
          isKeyword: true,
        },
      },
    ],
  },
];
