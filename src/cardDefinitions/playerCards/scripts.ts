import { drawCards } from "../../state/player";
import { modifyServerSecurity } from "../../state/server";
import { modifyClicks, setTurnNextPhase, TurnPhase } from "../../state/turn";
import type { CardDefinitions } from "../card";
import { CardRarity, CardType, TriggerMoment } from "../card";
import { KEYWORD_EFFECTS } from "../keywords";

export const scriptCards: CardDefinitions[] = [
  {
    cardEffects: [
      {
        getActions: () => [setTurnNextPhase(TurnPhase.Run)],
        getText: () => "Make a run.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    image: "_f3938419-60f6-42a9-8294-f8a93e848cd7.jpeg",
    name: "Run",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyServerSecurity(-1)],
        getText: () => "Reduce server security level by 1.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    name: "Crack",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      {
        getActions: () => [drawCards(3)],
        getText: () => "Draw 3 cards.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
      KEYWORD_EFFECTS.Trash,
    ],
    image: "_c8475f82-83d8-4a3d-8c5a-6fb3ff714234.jpeg",
    name: "Piece of Cake",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyClicks(3)],
        getText: () => "Gain 3 ticks.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
      KEYWORD_EFFECTS.Trash,
    ],
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    name: "Boost",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      {
        getActions: () => [],
        getText: () => "Destroy all programs.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
      KEYWORD_EFFECTS.Trash,
    ],
    image: "_0aa7847e-381f-4eed-ab4d-308573822c72.jpg",
    name: "Flush",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
];
