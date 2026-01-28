import { initiateRun } from "../state/phases/runPhase";
import { drawCards, modifyPlayerSignal } from "../state/player";
import { modifyServerSecurity } from "../state/server";
import { modifyClicks } from "../state/turn";
import type { CardDefinitions } from "./card";
import { CardRarity, CardType, TriggerMoment } from "./card";
import { KEYWORD_EFFECTS } from "./keywords";
import { CardId } from "./registry";

export const scriptCards: CardDefinitions[] = [
  {
    cardEffects: [
      {
        getText: () => "Initiate a run.",
        getThunk: () => initiateRun(),
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    id: CardId.RUN,
    image: "_cec483b7-55c5-4201-b001-d66cf9c187b0_crop_2.jpg",
    name: "Run",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [
      KEYWORD_EFFECTS.Stealthy,
      {
        getActions: () => [modifyPlayerSignal(5)],
        getText: () => "Gain 5 signal.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    id: CardId.FOCUS,
    image: "_1bb06829-ffb8-4ad1-9ac3-7918015bd34b.jpg",
    name: "Focus",
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
    id: CardId.CRACK,
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
    id: CardId.PIECE_OF_CAKE,
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
    id: CardId.BOOST_ENERGY_ULTRA,
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    name: "Boost Energy Ultra",
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
    id: CardId.FLUSH,
    image: "_0aa7847e-381f-4eed-ab4d-308573822c72.jpg",
    name: "Flush",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
];
