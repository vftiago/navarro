/**
 * Legacy Card Factory - Builds old-shape PlayingCards from the new
 * pure-data definitions in src/cards/definitions.
 *
 * State and UI still consume the legacy `PlayingCard` shape (definition
 * spread + deckContextId); this bridge keeps them working until the
 * definition/instance split lands (card-registry Phase 4).
 */
import { v4 as uuid } from "uuid";
import type { CardDefinition, IceCardDefinition } from "../cards/definitions";
import {
  agendaCardDefinitions,
  iceCardDefinitions,
  programCardDefinitions,
  scriptCardDefinitions,
  trapCardDefinitions,
} from "../cards/definitions";
import { resolveEffectSpecs, specToCardEffect } from "../cards/engine";
import type { CardDefinitions, CardEffect, IceCardDefinitions } from "./card";
import { CardType } from "./card";
import { KEYWORD_EFFECTS } from "./keywords";
import type { CardId, IceCardId, PlayerCardId, ServerCardId } from "./registry";

// Keywords render (and are queried via hasKeyword) as CardEffect entries
// in the legacy shape; real keyword mechanics land in Phase 3
const toCardEffects = (definition: CardDefinition): CardEffect[] => [
  ...(definition.keywords ?? []).map((keyword) => KEYWORD_EFFECTS[keyword]),
  ...resolveEffectSpecs(definition).map(specToCardEffect),
];

const toLegacyBase = (definition: CardDefinition) => ({
  cardEffects: toCardEffects(definition),
  id: definition.id,
  image: definition.image,
  name: definition.name,
  rarity: definition.rarity,
  ...(definition.flavorText && { flavorText: definition.flavorText }),
});

const toLegacyIceCard = (
  definition: IceCardDefinition,
): IceCardDefinitions => ({
  ...toLegacyBase(definition),
  damage: definition.damage,
  getStrength: () => definition.strength,
  isRezzed: true,
  subtype: definition.subtype,
  type: definition.type,
});

const toLegacyCard = (definition: CardDefinition): CardDefinitions => {
  switch (definition.type) {
    case CardType.ICE:
      return toLegacyIceCard(definition);
    case CardType.AGENDA:
      return {
        ...toLegacyBase(definition),
        type: definition.type,
        victoryPoints: definition.victoryPoints,
      };
    case CardType.PROGRAM:
      return {
        ...toLegacyBase(definition),
        subtype: definition.subtype,
        type: definition.type,
      };
    default:
      return { ...toLegacyBase(definition), type: definition.type };
  }
};

const playerCards = [...programCardDefinitions, ...scriptCardDefinitions].map(
  toLegacyCard,
);
const serverCards = [
  ...agendaCardDefinitions,
  ...iceCardDefinitions,
  ...trapCardDefinitions,
].map(toLegacyCard);
const iceCards = iceCardDefinitions.map(toLegacyIceCard);
const allCards = [...playerCards, ...serverCards];

// Card registry maps for O(1) lookup by ID
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
