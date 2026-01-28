import type { CardDefinitions } from "./card";
import { CardRarity, CardType, TriggerMoment } from "./card";
import { effect, EffectId } from "./effects";
import { KEYWORD_EFFECTS } from "./keywords";
import { CardId } from "./registry";

export const scriptCards: CardDefinitions[] = [
  {
    cardEffects: [effect(EffectId.INITIATE_RUN)],
    id: CardId.RUN,
    image: "_cec483b7-55c5-4201-b001-d66cf9c187b0_crop_2.jpg",
    name: "Run",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [KEYWORD_EFFECTS.Stealthy, effect(EffectId.GAIN_SIGNAL_5)],
    id: CardId.FOCUS,
    image: "_1bb06829-ffb8-4ad1-9ac3-7918015bd34b.jpg",
    name: "Focus",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [effect(EffectId.REDUCE_SERVER_SECURITY_1)],
    id: CardId.CRACK,
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    name: "Crack",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [effect(EffectId.DRAW_CARDS_3), KEYWORD_EFFECTS.Trash],
    id: CardId.PIECE_OF_CAKE,
    image: "_c8475f82-83d8-4a3d-8c5a-6fb3ff714234.jpeg",
    name: "Piece of Cake",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    cardEffects: [effect(EffectId.GAIN_CLICKS_3), KEYWORD_EFFECTS.Trash],
    id: CardId.BOOST_ENERGY_ULTRA,
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    name: "Boost Energy Ultra",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    // TODO: Implement "Destroy all programs" effect
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
