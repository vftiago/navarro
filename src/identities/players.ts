import { PlayingCardT } from "../cards/cards";

export type PlayerT = {
  deck: PlayingCardT[];
  currentDeck: PlayingCardT[];
  hand: PlayingCardT[];
  discard: PlayingCardT[];
  handSize: number;
};
