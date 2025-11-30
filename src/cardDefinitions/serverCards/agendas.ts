import {
  modifyPlayerTags,
  modifyPlayerVictoryPoints,
} from "../../state/player";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  type AgendaCardDefinitions,
} from "../card";

export const agendaCards: AgendaCardDefinitions[] = [
  {
    cardEffects: [
      {
        getActions: () => [modifyPlayerTags(1)],
        getText: () => "On Fetch, gain 1 tag.",
        triggerMoment: TriggerMoment.ON_FETCH,
      },
      {
        getActions: () => [modifyPlayerVictoryPoints(3)],
        getText: () => "Score 3.",
        triggerMoment: TriggerMoment.ON_FETCH,
      },
    ],
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    name: "Signal Broadcast",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 2,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyPlayerVictoryPoints(2)],
        getText: () => "Score 2.",
        triggerMoment: TriggerMoment.ON_FETCH,
      },
    ],
    image: "_0bdf6635-5355-45f7-9c9c-8fc0773a4f1d.jpeg",
    name: "Corporate Secrets",
    rarity: CardRarity.COMMON,
    type: CardType.AGENDA,
    victoryPoints: 1,
  },
];
