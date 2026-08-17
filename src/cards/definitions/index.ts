/**
 * Card Definitions - Pure-data card registry
 *
 * See CARD_REGISTRY.md for the architecture and migration plan.
 */
import type { CardId, IceCardId } from "../ids";
import { agendaCardDefinitions } from "./agendas";
import { iceCardDefinitions } from "./ice";
import { programCardDefinitions } from "./programs";
import { scriptCardDefinitions } from "./scripts";
import { trapCardDefinitions } from "./traps";
import type { CardDefinition, IceCardDefinition } from "./types";

export const cardDefinitions: CardDefinition[] = [
  ...agendaCardDefinitions,
  ...iceCardDefinitions,
  ...programCardDefinitions,
  ...scriptCardDefinitions,
  ...trapCardDefinitions,
];

const definitionRegistry = new Map<CardId, CardDefinition>(
  cardDefinitions.map((definition) => [definition.id, definition]),
);

/**
 * Get a card definition by id (type-safe, O(1) lookup)
 */
export const getCardDefinition = (id: CardId): CardDefinition => {
  const definition = definitionRegistry.get(id);
  if (!definition) {
    throw new Error(`Card definition not found: ${id}`);
  }

  return definition;
};

const iceDefinitionRegistry = new Map<IceCardId, IceCardDefinition>(
  iceCardDefinitions.map((definition) => [definition.id, definition]),
);

/**
 * Get an ice card definition by id (type-safe, O(1) lookup)
 */
export const getIceCardDefinition = (id: IceCardId): IceCardDefinition => {
  const definition = iceDefinitionRegistry.get(id);
  if (!definition) {
    throw new Error(`Ice card definition not found: ${id}`);
  }

  return definition;
};

export { agendaCardDefinitions } from "./agendas";
export { iceCardDefinitions } from "./ice";
export { programCardDefinitions } from "./programs";
export { scriptCardDefinitions } from "./scripts";
export { trapCardDefinitions } from "./traps";
export type {
  AgendaCardDefinition,
  BaseCardDefinition,
  CardDefinition,
  GenericCardDefinition,
  IceCardDefinition,
  ProgramCardDefinition,
} from "./types";
