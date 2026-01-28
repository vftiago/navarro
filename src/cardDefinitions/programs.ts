import {
  CardRarity,
  CardType,
  ProgramSubtype,
  type ProgramCardDefinitions,
} from "./card";
import { effect, EffectId } from "./effects";
import { CardId } from "./registry";

export const programCards: ProgramCardDefinitions[] = [
  {
    cardEffects: [effect(EffectId.SLEDGEHAMMER_BREAK_BARRIER)],
    flavorText: "Crude, but effective.",
    id: CardId.SLEDGEHAMMER,
    image: "_09df83ab-9d58-4100-996f-dc93127dce30.jpg",
    name: "Sledgehammer",
    rarity: CardRarity.COMMON,
    subtype: ProgramSubtype.FRACTER,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [effect(EffectId.DEEP_THOUGHTS_EXTRA_DRAW)],
    id: CardId.DEEP_THOUGHTS,
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    name: "Deep Thoughts",
    rarity: CardRarity.RARE,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [effect(EffectId.RUNNING_SNEAKERS_ON_RUN_END)],
    flavorText: "Gotta go fast.",
    id: CardId.RUNNING_SNEAKERS,
    image: "_180289ee-9360-41f9-84b5-8555685ff210.jpg",
    name: "Running Sneakers",
    rarity: CardRarity.RARE,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [effect(EffectId.INTRUSIVE_THOUGHTS_UPKEEP)],
    id: CardId.INTRUSIVE_THOUGHTS,
    image: "_c70fe080-5f2d-474a-9431-5d9fd7e4ed9c.jpg",
    name: "Intrusive Thoughts",
    rarity: CardRarity.UNCOMMON,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
];
