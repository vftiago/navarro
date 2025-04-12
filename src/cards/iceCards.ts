import { v4 as uuid } from "uuid";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  CardSubtype,
  ICECardPropertiesT,
} from "./card";

export const iceCards: ICECardPropertiesT[] = [
  {
    id: uuid(),
    name: "Ice Wall",
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.BARRIER,
    rezzed: false,
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
    rezzed: false,
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
    rezzed: false,
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
    rezzed: false,
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
