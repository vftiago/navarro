import { CardRarity, CardPropertiesT, CardType, TriggerMoment } from "./card";
import { v4 as uuid } from "uuid";
import { KEYWORD_EFFECTS } from "./keywords";
import { GamePhase } from "../gameReducer";

export const playerCards: CardPropertiesT[] = [
  {
    id: uuid(),
    name: "Hack",
    image: "_f3938419-60f6-42a9-8294-f8a93e848cd7.jpeg",
    rarity: CardRarity.BASIC,
    type: CardType.ACTION,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        callback: (gameState) => {
          return {
            ...gameState,
            nextAction: {
              type: GamePhase.Access,
              cardCount: 1,
            },
          };
        },
        getText: () => "Access 1 card.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Crack",
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    rarity: CardRarity.BASIC,
    type: CardType.ACTION,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            securityLevel: gameState.securityLevel - 1,
          };

          return newGameState;
        },
        getText: () => "Reduce server security level by 1.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Boost",
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    rarity: CardRarity.RARE,
    type: CardType.ACTION,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            tick: gameState.tick + 3,
          };

          return newGameState;
        },
        getText: () => "Gain 3 ticks.",
      },
      KEYWORD_EFFECTS.Trash,
    ],
  },
  {
    id: uuid(),
    name: "Sledgehammer",
    image: "_6fdd0eac-ec92-4402-8e7c-e1d0ca9ebd8a.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.PROGRAM,
    cardEffects: [
      {
        cost: 1,
        triggerMoment: TriggerMoment.ON_PLAY,
        callback: (gameState) => gameState,
        getText: () => "Deal 3 damage to the next Barrier.",
      },
    ],
    flavorText: "Crude, but effective.",
  },
  {
    id: uuid(),
    name: "Deep Thoughts",
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    rarity: CardRarity.UNCOMMON,
    type: CardType.PROGRAM,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.PERMANENT,
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 1,
            },
          };

          return newGameState;
        },
        getText: () => "Draw 1 extra card per turn.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Sixth Sense",
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    rarity: CardRarity.UNCOMMON,
    type: CardType.PROGRAM,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.PERMANENT,
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 1,
            },
          };

          return newGameState;
        },
        getText: () =>
          "You can see the rarity of the next server card you would access.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Flush",
    image: "_0aa7847e-381f-4eed-ab4d-308573822c72.jpg",
    rarity: CardRarity.RARE,
    type: CardType.ACTION,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        callback: (gameState) => {
          const newGameState = {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 1,
            },
          };

          return newGameState;
        },
        getText: () => "Destroy all programs.",
      },
      KEYWORD_EFFECTS.Trash,
    ],
  },
];
