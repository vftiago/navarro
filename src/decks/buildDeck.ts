import { v4 as uuid } from "uuid";
import { CardPropertiesT, PlayingCardT } from "../cards/cards";

export const createDeck = (deck: CardPropertiesT[]): PlayingCardT[] => {
  return deck.map(createPlayingCard);
};

export const createPlayingCard = (card: CardPropertiesT): PlayingCardT => {
  return {
    ...card,
    deckContextId: uuid(),
  };
};
