import {
  CardRarity,
  CardType,
  TriggerMoment,
  ProgramSubtype,
  ProgramCardDefinitions,
} from "../card";

import { addPermanentEffect } from "../../state/reducers/boardReducer";

export const programCards: ProgramCardDefinitions[] = [
  {
    name: "Sledgehammer",
    image: "_6fdd0eac-ec92-4402-8e7c-e1d0ca9ebd8a.jpeg",
    rarity: CardRarity.COMMON,
    type: CardType.PROGRAM,
    subtype: ProgramSubtype.FRACTER,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [],
        getText: () => "Deal 3 damage to the next Barrier.",
      },
    ],
    flavorText: "Crude, but effective.",
  },
  {
    name: "Deep Thoughts",
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    rarity: CardRarity.UNCOMMON,
    type: CardType.PROGRAM,
    subtype: ProgramSubtype.AI,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: ({ sourceId }) => {
          if (!sourceId) {
            throw new Error("Source ID is required for Deep Thoughts.");
          }

          const permanentEffect = {
            sourceId,
            targetSelector: "getPlayerCardsPerTurn",
            getModifier: () => {
              return 1;
            },
          };

          return [addPermanentEffect(permanentEffect)];
        },
        getText: () => "Draw 1 extra card per turn.",
      },
    ],
  },
  {
    name: "Sixth Sense",
    image: "_b47f337e-e71d-4ced-8e50-bfaae92f4a4e.jpeg",
    rarity: CardRarity.UNCOMMON,
    type: CardType.PROGRAM,
    subtype: ProgramSubtype.AI,
    cardEffects: [
      {
        triggerMoment: TriggerMoment.ON_PLAY,
        getActions: () => [],
        getText: () =>
          "You can see the rarity of the next server card you would access.",
      },
    ],
  },
];
