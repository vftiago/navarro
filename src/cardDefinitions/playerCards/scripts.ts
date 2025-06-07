import { CardRarity, CardDefinitions, CardType, TriggerMoment } from "../card";
import { KEYWORD_EFFECTS } from "../keywords";
import {
  modifyClicks,
  setTurnNextPhase,
  TurnPhase,
} from "../../state/reducers/turnReducer";
import { modifyServerSecurity } from "../../state/reducers/serverReducer";

export const scriptCards: CardDefinitions[] = [
  {
    name: "Run",
    image: "_f3938419-60f6-42a9-8294-f8a93e848cd7.jpeg",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [setTurnNextPhase(TurnPhase.Run)],
        getText: () => "Make a run.",
      },
    ],
  },
  {
    name: "Crack",
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [modifyServerSecurity(-1)],
        getText: () => "Reduce server security level by 1.",
      },
    ],
  },
  {
    name: "Piece of Cake",
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [modifyClicks(3)],
        getText: () => "Draw 3 cards.",
      },
      KEYWORD_EFFECTS.Trash,
    ],
  },
  {
    name: "Boost",
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [modifyClicks(3)],
        getText: () => "Gain 3 ticks.",
      },
      KEYWORD_EFFECTS.Trash,
    ],
  },
  {
    name: "Flush",
    image: "_0aa7847e-381f-4eed-ab4d-308573822c72.jpg",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [],
        getText: () => "Destroy all programs.",
      },
      KEYWORD_EFFECTS.Trash,
    ],
  },
];
