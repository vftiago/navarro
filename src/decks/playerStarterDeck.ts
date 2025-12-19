import { createPlayerPlayingCard } from "../cardDefinitions/createPlayingCard";

const deckList = [
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Focus",
  "Focus",
  "Focus",
  "Running Sneakers",
  "Boost Energy Ultra",
  "Piece of Cake",
  "Sledgehammer",
  "Intrusive Thoughts",
];

export const playerStarterDeck = deckList.map((card) =>
  createPlayerPlayingCard(card),
);
