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
  addWeight(["Fire Wall"], 1),
  addWeight(["Ice Wall"], 3),
  addWeight(["Authenticator"], 5),
  addWeight(["Bad Moon"], 3),
];

export const weightedServerICEDeck = weighted(
  weightedServerICECardList.flatMap((card) => card),
);

const weightedServerCardList = [
  addWeight(["Junk"], 5),
  addWeight(["Scintillating Scotoma"], 1),
  addWeight(["Signal Broadcast"], 1),
  addWeight(["Corporate Secrets"], 1),
];

export const weightedServerCards = weighted(
  weightedServerCardList.flatMap((card) => card),
);
