import { addWeight, weighted } from "@lrkit/weighted";

const weightedServerIceCardList = [
  addWeight(["Fire Wall"], 1),
  addWeight(["Ice Wall"], 3),
  addWeight(["Authenticator"], 5),
  addWeight(["Bad Moon"], 3),
];

export const weightedServerIceDeck = weighted(
  weightedServerIceCardList.flatMap((card) => card),
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
