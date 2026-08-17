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
import type {
  CardDefinitions,
  CardEffect,
  IceCardDefinitions,
  Keyword,
} from "./card";
import { CardType, TriggerMoment } from "./card";
import type { CardId, IceCardId, PlayerCardId, ServerCardId } from "./registry";

// Display-only entry so keywords render in the legacy card UI; keyword
// behavior lives in the keyword registry (flags/grants), not here
const keywordToCardEffect = (keyword: Keyword): CardEffect => ({
  getActions: () => [],
  getText: () => `${keyword}.`,
  keyword,
  triggerMoment: TriggerMoment.ON_PLAY,
});

const toCardEffects = (definition: CardDefinition): CardEffect[] => [
  ...(definition.keywords ?? []).map(keywordToCardEffect),
  ...resolveEffectSpecs(definition).map(specToCardEffect),
];

const toLegacyBase = (definition: CardDefinition) => ({
  cardEffects: toCardEffects(definition),
  id: definition.id,
  image: definition.image,
  name: definition.name,
  rarity: definition.rarity,
  ...(definition.flavorText && { flavorText: definition.flavorText }),
  ...(definition.keywords && { keywords: definition.keywords }),
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
