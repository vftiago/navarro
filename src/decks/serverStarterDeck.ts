import { addWeight, weighted } from "@lrkit/weighted";
import type { IceCardId, ServerCardId } from "../cardDefinitions/registry";
import { CardId } from "../cardDefinitions/registry";

/**
 * Weighted ice card pool for server deck generation
 * Higher weight = more likely to appear
 */
const weightedServerIceList = [
  addWeight([CardId.FIRE_WALL] as IceCardId[], 1),
  addWeight([CardId.ICE_WALL] as IceCardId[], 3),
  addWeight([CardId.BIOMETRIC_AUTHENTICATOR] as IceCardId[], 3),
  addWeight([CardId.BAD_MOON] as IceCardId[], 1),
  addWeight([CardId.WALL_OF_STATIC] as IceCardId[], 5),
];

export const weightedServerIce = weighted(
  weightedServerIceList.flatMap((card) => card),
);

/**
 * Weighted server card pool (non-ice cards)
 * Higher weight = more likely to appear
 */
const weightedServerCardList = [
  addWeight([CardId.JUNK] as ServerCardId[], 3),
  addWeight([CardId.SCINTILLATING_SCOTOMA] as ServerCardId[], 1),
  addWeight([CardId.SIGNAL_BROADCAST] as ServerCardId[], 1),
  addWeight([CardId.CORPORATE_SECRETS] as ServerCardId[], 1),
];

export const weightedServerCards = weighted(
  weightedServerCardList.flatMap((card) => card),
);
