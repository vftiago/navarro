import { createPlayerPlayingCard } from "../cardDefinitions/createPlayingCard";

const deckList = [
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Running Sneakers",
  "Crack",
  "Boost",
  "Piece of Cake",
  "Sledgehammer",
  "Intrusive Thoughts",
];

export const playerStarterDeck = deckList.map((card) =>
  createPlayerPlayingCard(card),
);
