import type { CardInstance, IceCardInstance } from "../../cards/instance";
import {
  createCardInstance,
  createIceCardInstance,
} from "../../cards/instance";
import {
  weightedServerCards,
  weightedServerIce,
} from "../../decks/serverStarterDeck";

export const getRandomServerCard = (): CardInstance => {
  return createCardInstance(weightedServerCards.pick());
};

export const getRandomIceCard = (): IceCardInstance => {
  return createIceCardInstance(weightedServerIce.pick());
};
