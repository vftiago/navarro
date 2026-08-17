/**
 * Card Engine - Effects, conditions, and text generation
 *
 * See CARD_REGISTRY.md for the architecture and migration plan.
 */
export * from "./effects";
export {
  executeEffectSpec,
  executeTriggers,
  getEffectSpecsByTrigger,
} from "./execute";
export {
  getKeywordDefinition,
  getKeywordGrants,
  hasKeywordFlag,
  keywordRegistry,
  type KeywordDefinition,
  type KeywordFlags,
} from "./keywords";
export { getImplicitEffects, resolveEffectSpecs } from "./resolve";
export {
  type CardTextLine,
  getCardTextLines,
  getEffectiveTrigger,
  renderCardText,
  renderEffectBody,
  renderEffectText,
} from "./text";
