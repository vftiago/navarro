import type { PermanentEffectT } from "../state/board";
import { addPermanentEffect } from "../state/board";
import { endRun } from "../state/phases";
import { modifyPlayerTags } from "../state/player";
import { getServerSecurityLevel } from "../state/server";
import { modifyClicks } from "../state/turn";
import { dealNetDamage } from "../state/utils";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  IceSubtype,
  type IceCardDefinitions,
} from "./card";
import { CardId } from "./registry";

export const iceCards: IceCardDefinitions[] = [
  {
    cardEffects: [
      {
        getActions: () => [modifyClicks(-1)],
        getText: () => "Lose 1 click.",
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    damage: 0,
    flavorText: `"It's gonna take forever to go around that."`,
    getStrength: () => 8,
    id: CardId.ICE_WALL,
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    isRezzed: true,
    name: "Ice Wall",
    rarity: CardRarity.COMMON,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
  {
    cardEffects: [
      {
        getActions: ({ gameState, sourceId, targetId }) => {
          if (!sourceId || !targetId) {
            throw new Error("Source and Target IDs required.");
          }

          const permanentEffect: PermanentEffectT = {
            getModifier: ({ sourceId, targetId }) => {
              return sourceId === targetId
                ? gameState.serverState.serverSecurityLevel
                : 0;
            },
            sourceId,
            targetSelector: "getIceStrength",
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () =>
          "Fire Wall's strength is equal to the server security level.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
      {
        getText: () => "Take 1 net damage per server security level.",
        getThunk: ({ gameState }) => {
          const serverSecurityLevel = getServerSecurityLevel(gameState);
          return dealNetDamage(serverSecurityLevel);
        },
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    damage: 0,
    getStrength: (gameState) => gameState.serverState.serverSecurityLevel,
    id: CardId.FIRE_WALL,
    image: "_4515fe90-c014-4035-9d3d-b9ea681a7b0e.jpeg",
    isRezzed: true,
    name: "Fire Wall",
    rarity: CardRarity.COMMON,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyPlayerTags(1)],
        getText: () => "Gain 1 tag.",
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    damage: 0,
    getStrength: () => 5,
    id: CardId.BIOMETRIC_AUTHENTICATOR,
    image: "_61f45f4f-382f-4edd-a7ea-eaef9a2e1e6c.jpg",
    isRezzed: true,
    name: "Biometric Authenticator",
    rarity: CardRarity.COMMON,
    subtype: IceSubtype.CODE_GATE,
    type: CardType.ICE,
  },
  {
    cardEffects: [
      {
        getActions: ({ sourceId }) => {
          if (!sourceId) {
            throw new Error("Source and Target IDs required.");
          }

          const permanentEffect: PermanentEffectT = {
            getModifier: ({ sourceId, targetId }) => {
              return sourceId === targetId ? 0 : 1;
            },
            sourceId,
            targetSelector: "getIceStrength",
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () => "Other Ice gain 1 strength.",
        triggerMoment: TriggerMoment.ON_REZ,
      },
    ],
    damage: 0,
    getStrength: () => 4,
    id: CardId.BAD_MOON,
    image: "_4653d721-be51-4949-b607-e801ff20d111.jpg",
    isRezzed: true,
    name: "Bad Moon",
    rarity: CardRarity.COMMON,
    subtype: IceSubtype.SENTRY,
    type: CardType.ICE,
  },
  {
    cardEffects: [
      {
        getText: () => "End the run.",
        getThunk: () => endRun(),
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    damage: 0,
    getStrength: () => 5,
    id: CardId.WALL_OF_STATIC,
    image: "_dc9200b9-8646-4665-9558-cb356a865c7e.jpg",
    isRezzed: true,
    name: "Wall of Static",
    rarity: CardRarity.COMMON,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
];
