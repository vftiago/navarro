import { v4 as uuid } from "uuid";
import { agendaCards } from "./agendas";
import { iceCards } from "./ice";
import { programCards } from "./programs";
import type { CardId, IceCardId, PlayerCardId, ServerCardId } from "./registry";
import { scriptCards } from "./scripts";
import { trapCards } from "./traps";

const playerCards = [...programCards, ...scriptCards];
const serverCards = [...agendaCards, ...iceCards, ...trapCards];
const allCards = [...playerCards, ...serverCards];

// Card registry map for O(1) lookup by ID
const cardRegistry = new Map(allCards.map((card) => [card.id, card]));
const playerCardRegistry = new Map(playerCards.map((card) => [card.id, card]));
const serverCardRegistry = new Map(serverCards.map((card) => [card.id, card]));
const iceCardRegistry = new Map(iceCards.map((card) => [card.id, card]));

/**
 * Get a card definition by ID (type-safe, O(1) lookup)
 */
export const getCardById = (id: CardId) => {
  const card = cardRegistry.get(id);
  if (!card) {
    throw new Error(`Card not found: ${id}`);
  }
  return card;
};

/**
 * Create a server playing card by ID (type-safe)
 */
export const createServerCardById = (id: ServerCardId) => {
  const card = serverCardRegistry.get(id);
  if (!card) {
    throw new Error(`Server card not found: ${id}`);
  }
  return {
    ...card,
    deckContextId: uuid(),
  };
};

/**
 * Create a player playing card by ID (type-safe)
 */
export const createPlayerCardById = (id: PlayerCardId) => {
  const card = playerCardRegistry.get(id);
  if (!card) {
    throw new Error(`Player card not found: ${id}`);
  }
  return {
    ...card,
    deckContextId: uuid(),
  };
};

/**
 * Create an ice playing card by ID (type-safe)
 */
export const createIceCardById = (id: IceCardId) => {
  const card = iceCardRegistry.get(id);
  if (!card) {
    throw new Error(`Ice card not found: ${id}`);
  }
  return {
    ...card,
    deckContextId: uuid(),
  };
};

// =============================================================================
// Legacy name-based functions (deprecated, use ID-based functions above)
// =============================================================================

/**
 * @deprecated Use createServerCardById instead
 */
export const createServerPlayingCard = (name: string) => {
  const card = serverCards.find((card) => card.name === name);

  if (!card) {
    throw new Error(`Card not found: ${name}`);
  }

  return {
    ...card,
    deckContextId: uuid(),
  };
};

/**
 * @deprecated Use createPlayerCardById instead
 */
export const createPlayerPlayingCard = (name: string) => {
  const card = playerCards.find((card) => card.name === name);

  if (!card) {
    throw new Error(`Card not found: ${name}`);
  }

  return {
    ...card,
    deckContextId: uuid(),
  };
};

/**
 * @deprecated Use createIceCardById instead
 */
export const createIcePlayingCard = (name: string) => {
  const card = iceCards.find((card) => card.name === name);

  if (!card) {
    throw new Error(`Card not found: ${name}`);
  }

  return {
    ...card,
    deckContextId: uuid(),
  };
};
