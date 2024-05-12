import { v4 as uuid } from "uuid";
import { CardBaseT, CardT } from "../cards/cards";

export const buildDeck = (deck: CardBaseT[]): CardT[] => {
  return deck.map((card) => {
    return {
      ...card,
      deckContextId: uuid(),
    };
  });
};
