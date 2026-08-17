import {
  CardRarity,
  CardType,
  Keyword,
  TriggerMoment,
} from "../../cardDefinitions/card";
import { CardId } from "../../cardDefinitions/registry";
import type { GenericCardDefinition } from "./types";

export const trapCardDefinitions: GenericCardDefinition[] = [
  {
    effects: [],
    id: CardId.JUNK,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    keywords: [Keyword.UNPLAYABLE, Keyword.ETHEREAL],
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
  },
  {
    effects: [
      {
        condition: { check: "server_security_at_least", params: { level: 3 } },
        effect: "end_run",
        trigger: TriggerMoment.ON_ACCESS,
      },
    ],
    id: CardId.SERVER_LOCKDOWN,
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    name: "Server Lockdown",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
  {
    effects: [
      {
        effect: "modify_clicks",
        params: { amount: -1 },
        trigger: TriggerMoment.ON_DRAW,
      },
    ],
    id: CardId.SCINTILLATING_SCOTOMA,
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    keywords: [Keyword.UNPLAYABLE, Keyword.ETHEREAL],
    name: "Scintillating Scotoma",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
];
