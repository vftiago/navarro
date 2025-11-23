import { addPermanentEffect } from "../../state/reducers/boardReducer";
import {
  CardRarity,
  CardType,
  TriggerMoment,
  ProgramSubtype,
  ProgramCardDefinitions,
  EffectCost,
} from "../card";

export const programCards: ProgramCardDefinitions[] = [
  {
    cardEffects: [
      {
        costs: [EffectCost.TRASH],
        getActions: () => [],
        getText: () => "Destroy target Barrier. Gain 5 noise.",
        triggerMoment: TriggerMoment.ON_CLICK,
      },
    ],
    flavorText: "Crude, but effective.",
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
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    name: "Deep Thoughts",
    rarity: CardRarity.UNCOMMON,
    subtype: ProgramSubtype.AI,
    type: CardType.PROGRAM,
  },
  {
    cardEffects: [
      {
        getActions: () => [],
        getText: () =>
          "You can see the rarity of the next server card you would access.",
        triggerMoment: TriggerMoment.ON_PLAY,
      },
    ],
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    name: "Sixth Sense",
    rarity: CardRarity.UNCOMMON,
    subtype: ProgramSubtype.AI,
    type: CardType.PROGRAM,
  },
];
