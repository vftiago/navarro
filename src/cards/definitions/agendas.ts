import {
  CardRarity,
  CardType,
  TriggerMoment,
} from "../../cardDefinitions/card";
import { CardId } from "../../cardDefinitions/registry";
import type { AgendaCardDefinition } from "./types";

export const agendaCardDefinitions: AgendaCardDefinition[] = [
  {
    effects: [
      {
        effect: "modify_tags",
        params: { amount: 1 },
        trigger: TriggerMoment.ON_FETCH,
      },
    ],
    id: CardId.SIGNAL_BROADCAST,
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    name: "Signal Broadcast",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 3,
  },
  {
    effects: [],
    id: CardId.CORPORATE_SECRETS,
    image: "_0bdf6635-5355-45f7-9c9c-8fc0773a4f1d.jpeg",
    name: "Corporate Secrets",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 2,
  },
];
