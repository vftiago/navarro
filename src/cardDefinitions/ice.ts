import {
  CardRarity,
  CardType,
  IceSubtype,
  TriggerMoment,
  type IceCardDefinitions,
} from "./card";
import { effect, EffectId } from "./effects";
import { CardId } from "./registry";

export const iceCards: IceCardDefinitions[] = [
  {
    cardEffects: [
      effect(EffectId.LOSE_CLICKS_1, {
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      }),
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
      effect(EffectId.FIRE_WALL_DYNAMIC_STRENGTH),
      effect(EffectId.FIRE_WALL_NET_DAMAGE),
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
      effect(EffectId.GAIN_TAG_1, {
        triggerMoment: TriggerMoment.ON_ENCOUNTER,
      }),
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
    cardEffects: [effect(EffectId.BAD_MOON_BUFF_OTHER_ICE)],
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
    cardEffects: [effect(EffectId.END_RUN)],
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
