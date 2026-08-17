/**
 * Card Instances - What game state stores
 *
 * An instance is a lightweight reference to a definition plus per-copy
 * mutable state. Definitions live only in the registry; state never holds
 * card data or functions, so it stays serializable.
 */
import { v4 as uuid } from "uuid";
import type { CardDefinition, IceCardDefinition } from "./definitions";
import { getCardDefinition, getIceCardDefinition } from "./definitions";
import type { CardId, IceCardId } from "./ids";

export type CardInstance = {
  definitionId: CardId;
  instanceId: string;
};

export type IceCardInstance = CardInstance & {
  definitionId: IceCardId;
  isRezzed: boolean;
};

export const createCardInstance = (id: CardId): CardInstance => ({
  definitionId: id,
  instanceId: uuid(),
});

export const createIceCardInstance = (id: IceCardId): IceCardInstance => ({
  definitionId: id,
  instanceId: uuid(),
  // The corp currently rezzes all ice on install
  isRezzed: true,
});

/**
 * Resolve an instance to its definition (O(1) registry lookup)
 */
export const resolveCard = (instance: CardInstance): CardDefinition => {
  return getCardDefinition(instance.definitionId);
};

/**
 * Resolve an ice instance to its (typed) ice definition
 */
export const resolveIceCard = (
  instance: IceCardInstance,
): IceCardDefinition => {
  return getIceCardDefinition(instance.definitionId);
};
