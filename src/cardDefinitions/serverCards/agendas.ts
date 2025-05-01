import {
  CardRarity,
  CardType,
  TriggerMoment,
  AgendaCardDefinitions,
} from "../card";
import {
  modifyPlayerTags,
  modifyPlayerVicotryPoints,
} from "../../state/reducers/playerReducer";

export const agendaCards: AgendaCardDefinitions[] = [
  {
    name: "Signal Broadcast",
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 2,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        getActions: () => [modifyPlayerTags(1)],
        getText: () => "When you fetch this card, gain 1 tag.",
      },
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        getActions: () => [modifyPlayerVicotryPoints(3)],
        getText: () => "Score 3.",
      },
    ],
  },
  {
    name: "Corporate Secrets",
    image: "_0bdf6635-5355-45f7-9c9c-8fc0773a4f1d.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_FETCH,
        getActions: () => [modifyPlayerVicotryPoints(2)],
        getText: () => "Score 2.",
      },
    ],
  },
];
