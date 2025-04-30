import { v4 as uuid } from "uuid";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  CardSubtype,
  IceCardPropertiesT,
} from "./card";

export const iceCards: IceCardPropertiesT[] = [
  {
    id: uuid(),
    name: "Ice Wall",
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: CardSubtype.BARRIER,
    isRezzed: false,
    damage: 0,
    getStrength: () => 8,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ACCESS,
        callback: (gameState) => {
          return {
            ...gameState,
            turnState: {
              ...gameState.turnState,
              turnRemainingClicks: gameState.turnState.turnRemainingClicks - 1,
            },
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
    isRezzed: false,
    damage: 0,
    getStrength: (gameState) => gameState.serverState.serverSecurityLevel,
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
          const newDiscard = [...gameState.playerState.playerDiscardPile];

          for (let i = 0; i < gameState.serverState.serverSecurityLevel; i++) {
            const card = gameState.playerState.playerHand[i];

            if (!card) {
              break;
            }

            newDiscard.unshift(card);
          }

          const newPlayerHand = gameState.playerState.playerHand.slice(
            0,
            -gameState.serverState.serverSecurityLevel,
          );

          return {
            ...gameState,
            player: {
              ...gameState.playerState,
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
    isRezzed: false,
    damage: 0,
    getStrength: () => 5,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ACCESS,
        callback: (gameState) => {
          return {
            ...gameState,
            playerState: {
              ...gameState.playerState,
              playerTags: gameState.playerState.playerTags + 1,
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
    isRezzed: false,
    damage: 0,
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
