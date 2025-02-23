import { PlayingCardT } from "../cards/card";
import {
  createPlayerPlayingCard,
  createServerPlayingCard,
} from "../cards/createPlayingCard";

export const createPlayerDeck = (cardList: string[]): PlayingCardT[] => {
  return cardList.map((card) => createPlayerPlayingCard(card));
};

export const createServerDeck = (cardList: string[]): PlayingCardT[] => {
  return cardList.map((card) => createServerPlayingCard(card));
};
