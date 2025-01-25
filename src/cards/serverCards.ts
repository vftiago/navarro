import { v4 as uuid } from "uuid";
import {
  CardRarity,
  CardPropertiesT,
  CardType,
  TriggerMoment,
  CardSubtype,
} from "./card";
import { KEYWORD_EFFECTS } from "./keywords";
import { GameState } from "../gameReducer";

export const serverCards: CardPropertiesT[] = [
  {
    id: uuid(),
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    cardEffects: [KEYWORD_EFFECTS.Unplayable, KEYWORD_EFFECTS.Ethereal],
  },
  {
    id: uuid(),
    name: "Server Lockdown",
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.EVENT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_REVEAL,
        callback: (gameState) => gameState,
        getText: () =>
          "If the server security level is 3 or more, end the run.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Signal Broadcast",
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              tags: gameState.player.tags + 1,
            },
          };
        },
        getText: () => "When you fetch this card, get 1 tag.",
      },
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 2,
            },
          };
        },
        getText: () => "Score 2.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Corporate Secrets",
    image: "_0bdf6635-5355-45f7-9c9c-8fc0773a4f1d.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              victoryPoints: gameState.player.victoryPoints + 1,
            },
          };
        },
        getText: () => "Score 1.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Scintillating Scotoma",
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.TRAP,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_DRAW,
        callback: (gameState: GameState) => {
          return {
            ...gameState,
            tick: gameState.tick - 1,
          };
        },
        getText: () => "When you draw this card, lose 1 tick.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Ice Wall",
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.BARRIER,
    getStrength: () => 8,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ACCESS,
        callback: (gameState) => {
          return {
            ...gameState,
            tick: gameState.tick - 1,
          };
        },
        getText: () => "Lose 1 tick.",
      },
    ],
    flavorText: `"It's gonna take forever to go around that thing."`,
  },
  {
    id: uuid(),
    name: "Fire Wall",
    image: "_4515fe90-c014-4035-9d3d-b9ea681a7b0e.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.BARRIER,
    getStrength: (gameState) => gameState.securityLevel,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.PERMANENT,
        callback: (gameState) => {
          return gameState;
        },
        getText: () =>
          "Fire Wall's strength is equal to the server security level.",
      },
      {
        triggerMoment: TriggerMoment.ON_ACCESS,
        callback: (gameState) => {
          const newDiscard = [...gameState.player.discard];

          for (let i = 0; i < gameState.securityLevel; i++) {
            const card = gameState.player.hand[i];

            if (!card) {
              break;
            }

            newDiscard.unshift(card);
          }

          const newPlayerHand = gameState.player.hand.slice(
            0,
            -gameState.securityLevel,
          );

          return {
            ...gameState,
            player: {
              ...gameState.player,
              hand: newPlayerHand,
              discard: newDiscard,
            },
          };
        },
        getText: () => "Take 1 net damage per server security level.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Authenticator",
    image: "_61f45f4f-382f-4edd-a7ea-eaef9a2e1e6c.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.CODE_GATE,
    getStrength: () => 5,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ACCESS,
        callback: (gameState) => {
          return {
            ...gameState,
            player: {
              ...gameState.player,
              tags: gameState.player.tags + 1,
            },
          };
        },
        getText: () => "Gain 1 tag.",
      },
    ],
  },
  {
    id: uuid(),
    name: "Bad Moon",
    image: "_4653d721-be51-4949-b607-e801ff20d111.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.SENTRY,
    getStrength: () => 4,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.PERMANENT,
        callback: (gameState) => {
          return gameState;
        },
        getText: () => "Other ICE gain 1 strength.",
      },
    ],
  },
];
