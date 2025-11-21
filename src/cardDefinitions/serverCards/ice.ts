import {
  CardRarity,
  CardType,
  TriggerMoment,
  IceSubtype,
  IceCardDefinitions,
} from "../card";
import { modifyClicks } from "../../state/reducers/turnReducer";
import {
  addPermanentEffect,
  PermanentEffectT,
} from "../../state/reducers/boardReducer";
import {
  modifyPlayerTags,
  removeRandomCardFromHand,
} from "../../state/reducers/playerReducer";
import { getServerSecurityLevel } from "../../state/selectors";

export const iceCards: IceCardDefinitions[] = [
  {
    name: "Ice Wall",
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: IceSubtype.BARRIER,
    isRezzed: true,
    damage: 0,
    getStrength: () => 8,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
        getActions: () => [modifyClicks(-1)],
        getText: () => "Lose 1 click.",
      },
    ],
    flavorText: `"It's gonna take forever to go around that."`,
  },
  {
    name: "Fire Wall",
    image: "_4515fe90-c014-4035-9d3d-b9ea681a7b0e.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: IceSubtype.BARRIER,
    isRezzed: true,
    damage: 0,
    getStrength: (gameState) => gameState.serverState.serverSecurityLevel,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: ({ gameState, sourceId, targetId }) => {
          if (!sourceId || !targetId) {
            throw new Error(
              "Source ID and Target ID are required for Bad Moon.",
            );
          }

          const permanentEffect: PermanentEffectT = {
            sourceId,
            targetSelector: "getIceStrength",
            getModifier: ({ sourceId, targetId }) => {
              return sourceId === targetId
                ? gameState.serverState.serverSecurityLevel
                : 0;
            },
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () =>
          "Fire Wall's strength is equal to the server security level.",
      },
      {
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
        getActions: ({ gameState }) => {
          const serverSecurityLevel = getServerSecurityLevel(gameState);

          const actions = [];

          for (let i = 0; i < serverSecurityLevel; i++) {
            actions.push(removeRandomCardFromHand());
          }

          return actions;
        },
        getText: () => "Take 1 net damage per server security level.",
      },
    ],
  },
  {
    name: "Biometric Authenticator",
    image: "_61f45f4f-382f-4edd-a7ea-eaef9a2e1e6c.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: IceSubtype.CODE_GATE,
    isRezzed: true,
    damage: 0,
    getStrength: () => 5,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
        getActions: () => [modifyPlayerTags(1)],
        getText: () => "Gain 1 tag.",
      },
    ],
  },
  {
    name: "Bad Moon",
    image: "_4653d721-be51-4949-b607-e801ff20d111.jpg",
    rarity: CardRarity.COMMON,
    type: CardType.ICE,
    subtype: IceSubtype.SENTRY,
    isRezzed: true,
    damage: 0,
    getStrength: () => 4,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_REZ,
        getActions: ({ sourceId }) => {
          if (!sourceId) {
            throw new Error(
              "Source ID and Target ID are required for Bad Moon.",
            );
          }

          const permanentEffect: PermanentEffectT = {
            sourceId,
            targetSelector: "getIceStrength",
            getModifier: ({ sourceId, targetId }) => {
              return sourceId === targetId ? 0 : 1;
            },
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () => "Other Ice gain 1 strength.",
      },
    ],
  },
];
