import {
  CardRarity,
  CardType,
  TriggerMoment,
  type ServerCardDefinitions,
} from "./card";
import { effect, EffectId } from "./effects";
import { KEYWORD_EFFECTS } from "./keywords";
import { CardId } from "./registry";

export const trapCards: ServerCardDefinitions[] = [
  {
    cardEffects: [KEYWORD_EFFECTS.Unplayable, KEYWORD_EFFECTS.Ethereal],
    id: CardId.JUNK,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    name: "Junk",
    rarity: CardRarity.BASIC,
    type: CardType.FILE,
  },
  {
    cardEffects: [effect(EffectId.SERVER_LOCKDOWN_CONDITIONAL_END)],
    id: CardId.SERVER_LOCKDOWN,
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    name: "Server Lockdown",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      effect(EffectId.LOSE_CLICKS_1, {
        getText: () => "On Draw, lose 1 tick.",
        triggerMoment: TriggerMoment.ON_DRAW,
      }),
      KEYWORD_EFFECTS.Unplayable,
      KEYWORD_EFFECTS.Ethereal,
    ],
    id: CardId.SCINTILLATING_SCOTOMA,
    image: "_60281fe6-4c0d-4b67-a6d4-28ab7754bf77.jpg",
    name: "Scintillating Scotoma",
    rarity: CardRarity.COMMON,
    type: CardType.SCRIPT,
  },
];
