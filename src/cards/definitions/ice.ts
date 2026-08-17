import {
  CardRarity,
  CardType,
  IceSubtype,
  TriggerMoment,
} from "../../cardDefinitions/card";
import { CardId } from "../../cardDefinitions/registry";
import type { IceCardDefinition } from "./types";

export const iceCardDefinitions: IceCardDefinition[] = [
  {
    damage: 0,
    effects: [
      {
        effect: "modify_clicks",
        params: { amount: -1 },
        trigger: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    flavorText: `"It's gonna take forever to go around that."`,
    id: CardId.ICE_WALL,
    image: "_2f5d81f7-6ad8-4b93-b932-95202eaa6f44.jpeg",
    name: "Ice Wall",
    rarity: CardRarity.COMMON,
    strength: 8,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
  {
    damage: 0,
    effects: [
      { effect: "strength_per_server_security" },
      { effect: "net_damage_per_security" },
    ],
    id: CardId.FIRE_WALL,
    image: "_4515fe90-c014-4035-9d3d-b9ea681a7b0e.jpeg",
    name: "Fire Wall",
    rarity: CardRarity.COMMON,
    strength: 0,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
  {
    damage: 0,
    effects: [
      {
        effect: "modify_tags",
        params: { amount: 1 },
        trigger: TriggerMoment.ON_ENCOUNTER,
      },
    ],
    id: CardId.BIOMETRIC_AUTHENTICATOR,
    image: "_61f45f4f-382f-4edd-a7ea-eaef9a2e1e6c.jpg",
    name: "Biometric Authenticator",
    rarity: CardRarity.COMMON,
    strength: 5,
    subtype: IceSubtype.CODE_GATE,
    type: CardType.ICE,
  },
  {
    damage: 0,
    effects: [{ effect: "modify_other_ice_strength", params: { amount: 1 } }],
    id: CardId.BAD_MOON,
    image: "_4653d721-be51-4949-b607-e801ff20d111.jpg",
    name: "Bad Moon",
    rarity: CardRarity.COMMON,
    strength: 4,
    subtype: IceSubtype.SENTRY,
    type: CardType.ICE,
  },
  {
    damage: 0,
    effects: [{ effect: "end_run" }],
    id: CardId.WALL_OF_STATIC,
    image: "_dc9200b9-8646-4665-9558-cb356a865c7e.jpg",
    name: "Wall of Static",
    rarity: CardRarity.COMMON,
    strength: 5,
    subtype: IceSubtype.BARRIER,
    type: CardType.ICE,
  },
];
