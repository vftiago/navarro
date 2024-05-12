import { CardRarityT, CardBaseT, CardTypeT } from "../cards.ts";

export const serverCards: CardBaseT[] = [
  {
    id: "0",
    name: "Junk",
    rarity: CardRarityT.BASIC,
    type: CardTypeT.FILE,
    image: "_2c63c6dc-7f51-4cac-9e6b-83be70b8909d.jpeg",
    effects: [
      {
        description: {
          text: "Ethereal.",
          isKeyword: true,
        },
      },
    ],
  },
  {
    id: "1",
    name: "Server Lockdown",
    image: "_3785e7cf-fe8c-4e05-905f-44f3a467aff3.jpeg",
    rarity: CardRarityT.COMMON,
    type: CardTypeT.EVENT,
    effects: [
      {
        callback: () => {},
        description: {
          text: "When you fetch this card, end the run.",
        },
      },
    ],
  },
  {
    id: "1",
    name: "Signal Broadcast",
    image: "_0b628974-25c9-4bc4-8eb0-ff8ed115b720.jpeg",
    rarity: CardRarityT.COMMON,
    type: CardTypeT.AGENDA,
    effects: [
      {
        callback: () => {},
        description: {
          text: "When you fetch this card, get 1 tag.",
        },
      },
    ],
  },
];
