import { addWeight, weighted } from "@lrkit/weighted";

const weightedServerIceList = [
  addWeight(["Fire Wall"], 1),
  addWeight(["Ice Wall"], 3),
  addWeight(["Biometric Authenticator"], 5),
  addWeight(["Bad Moon"], 3),
];

export const weightedServerIce = weighted(
  weightedServerIceList.flatMap((card) => card),
);

const weightedServerCardList = [
  addWeight(["Junk"], 3),
  addWeight(["Scintillating Scotoma"], 1),
  addWeight(["Signal Broadcast"], 1),
  addWeight(["Corporate Secrets"], 1),
];

export const weightedServerCards = weighted(
  weightedServerCardList.flatMap((card) => card),
);
