import { CardRarity, CardType, Keyword } from "../enums";
import { CardId } from "../ids";
import type { GenericCardDefinition } from "./types";

export const scriptCardDefinitions: GenericCardDefinition[] = [
  {
    effects: [{ effect: "initiate_run" }],
    id: CardId.RUN,
    image: "_cec483b7-55c5-4201-b001-d66cf9c187b0_crop_2.jpg",
    name: "Run",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    effects: [{ effect: "modify_signal", params: { amount: 5 } }],
    id: CardId.FOCUS,
    image: "_1bb06829-ffb8-4ad1-9ac3-7918015bd34b.jpg",
    keywords: [Keyword.STEALTHY],
    name: "Focus",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    effects: [{ effect: "modify_server_security", params: { amount: -1 } }],
    id: CardId.CRACK,
    image: "_644f230d-81bb-48a3-858c-0bf9051fe449.jpeg",
    name: "Crack",
    rarity: CardRarity.BASIC,
    type: CardType.SCRIPT,
  },
  {
    effects: [{ effect: "draw", params: { amount: 3 } }],
    id: CardId.PIECE_OF_CAKE,
    image: "_c8475f82-83d8-4a3d-8c5a-6fb3ff714234.jpeg",
    keywords: [Keyword.TRASH],
    name: "Piece of Cake",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    effects: [{ effect: "modify_clicks", params: { amount: 3 } }],
    id: CardId.BOOST_ENERGY_ULTRA,
    image: "_f8b5a836-17e4-42f0-9036-6696f5515c6c.jpeg",
    keywords: [Keyword.TRASH],
    name: "Boost Energy Ultra",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
  {
    effects: [{ effect: "destroy_all_programs" }],
    id: CardId.FLUSH,
    image: "_0aa7847e-381f-4eed-ab4d-308573822c72.jpg",
    keywords: [Keyword.TRASH],
    name: "Flush",
    rarity: CardRarity.RARE,
    type: CardType.SCRIPT,
  },
];
