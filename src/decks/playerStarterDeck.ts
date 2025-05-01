import { createPlayerPlayingCard } from "../cardDefinitions/createPlayingCard";

const deckList = [
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Run",
  "Crack",
  "Boost",
  "Sledgehammer",
  "Sledgehammer",
  "Deep Thoughts",
];

export const playerStarterDeck = deckList.map((card) =>
  createPlayerPlayingCard(card),
);
