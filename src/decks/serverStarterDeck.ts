import { createServerPlayingCard } from "../cards/createPlayingCard";
import { createServerDeck } from "./createDeck";

import { addWeight, weighted } from "@lrkit/weighted";

export const serverStarterDeck = createServerDeck([
  "Junk",
  "Junk",
  "Junk",
  "Junk",
  "Scintillating Scotoma",
  "Signal Broadcast",
  "Corporate Secrets",
]);

const weightedServerICECardList = [
  addWeight([createServerPlayingCard("Fire Wall")], 1),
  addWeight([createServerPlayingCard("Ice Wall")], 1),
  addWeight([createServerPlayingCard("Authenticator")], 1),
  addWeight([createServerPlayingCard("Bad Moon")], 1),
];

export const weightedServerICEDeck = weighted(
  weightedServerICECardList.flatMap((card) => card),
);

const weightedServerCardList = [
  addWeight([createServerPlayingCard("Junk")], 5),
  addWeight([createServerPlayingCard("Scintillating Scotoma")], 1),
  addWeight([createServerPlayingCard("Signal Broadcast")], 1),
  addWeight([createServerPlayingCard("Corporate Secrets")], 1),
];

export const weightedServerCards = weighted(
  weightedServerCardList.flatMap((card) => card),
);
