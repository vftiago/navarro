import { CardRarity, CardType, ProgramSubtype, TriggerMoment } from "../enums";
import { CardId } from "../ids";
import type { ProgramCardDefinition } from "./types";

export const programCardDefinitions: ProgramCardDefinition[] = [
  {
    // TODO: no mechanics yet — the icebreaker interaction (breaking
    // subroutines during an encounter) is not designed; when it lands it
    // will be a targeted event (e.g. PLAYER_BREAK_SUBROUTINE), and this
    // becomes program data like `breaks: IceSubtype.BARRIER`
    effects: [],
    flavorText: "Crude, but effective.",
    id: CardId.SLEDGEHAMMER,
    image: "_09df83ab-9d58-4100-996f-dc93127dce30.jpg",
    name: "Sledgehammer",
    rarity: CardRarity.COMMON,
    subtype: ProgramSubtype.FRACTER,
    text: "Break barrier subroutine.",
    type: CardType.PROGRAM,
  },
  {
    effects: [{ effect: "modify_cards_per_turn", params: { amount: 1 } }],
    id: CardId.DEEP_THOUGHTS,
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    name: "Deep Thoughts",
    rarity: CardRarity.RARE,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
  {
    effects: [
      {
        effect: "modify_clicks",
        params: { amount: 1 },
        text: "When you complete a run, gain 1 click.",
        trigger: TriggerMoment.ON_RUN_END,
      },
    ],
    flavorText: "Gotta go fast.",
    id: CardId.RUNNING_SNEAKERS,
    image: "_180289ee-9360-41f9-84b5-8555685ff210.jpg",
    name: "Running Sneakers",
    rarity: CardRarity.RARE,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
  {
    effects: [
      {
        effect: "draw",
        params: { amount: 1 },
        trigger: TriggerMoment.ON_UPKEEP,
      },
      {
        effect: "modify_clicks",
        params: { amount: -1 },
        trigger: TriggerMoment.ON_UPKEEP,
      },
    ],
    id: CardId.INTRUSIVE_THOUGHTS,
    image: "_c70fe080-5f2d-474a-9431-5d9fd7e4ed9c.jpg",
    name: "Intrusive Thoughts",
    rarity: CardRarity.UNCOMMON,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
];
