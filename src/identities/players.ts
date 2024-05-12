import { CardT } from "../cards/cards";

export type PlayerT = {
  deck: CardT[];
  currentDeck: CardT[];
  hand: CardT[];
  discard: CardT[];
  handSize: number;
};
