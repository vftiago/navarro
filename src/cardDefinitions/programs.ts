import { addPermanentEffect } from "../state/board";
import { drawCards } from "../state/player";
import { modifyClicks } from "../state/turn";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  ProgramSubtype,
  type ProgramCardDefinitions,
  EffectCost,
} from "./card";
import { CardId } from "./registry";

export const programCards: ProgramCardDefinitions[] = [
  {
    cardEffects: [
      {
        costs: [EffectCost.CLICK],
        getActions: () => [],
        getText: () => "Break barrier subroutine.",
        triggerMoment: TriggerMoment.ON_CLICK,
      },
    ],
    flavorText: "Crude, but effective.",
    id: CardId.SLEDGEHAMMER,
    image: "_09df83ab-9d58-4100-996f-dc93127dce30.jpg",
    name: "Sledgehammer",
    rarity: CardRarity.COMMON,
    subtype: ProgramSubtype.FRACTER,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [
      {
        getActions: ({ sourceId }) => {
          if (!sourceId) {
            throw new Error("Source ID is required for Deep Thoughts.");
          }

          const permanentEffect = {
            getModifier: () => {
              return 1;
            },
            sourceId,
            targetSelector: "getPlayerCardsPerTurn",
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () => "Draw 1 extra card per turn.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    id: CardId.DEEP_THOUGHTS,
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    name: "Deep Thoughts",
    rarity: CardRarity.RARE,
    subtype: ProgramSubtype.RESOURCE,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [
      {
        getActions: () => [modifyClicks(1)],
        getText: () => "When you complete a run, gain 1 click.",
        triggerMoment: TriggerMoment.ON_RUN_END,
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
    cardEffects: [
      {
        getActions: () => [drawCards(1), modifyClicks(-1)],
        getText: () =>
          "At the beginning of your turn, draw 1 card and lose 1 click.",
        triggerMoment: TriggerMoment.ON_UPKEEP,
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
