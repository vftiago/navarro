import { v4 as uuid } from "uuid";
import { serverCards } from "./serverCards";
import { playerCards } from "./playerCards";

export const createServerPlayingCard = (name: string) => {
  const card = serverCards.find((card) => card.name === name);

  if (!card) {
    throw new Error(`Card not found: ${name}`);
  }

  return {
    ...card,
    deckContextId: uuid(),
  };
};

export const createPlayerPlayingCard = (name: string) => {
  const card = playerCards.find((card) => card.name === name);

  if (!card) {
    throw new Error(`Card not found: ${name}`);
  }

  return {
    ...card,
    deckContextId: uuid(),
  };
};
