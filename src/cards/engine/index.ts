/**
 * Card Engine - Effects, conditions, and text generation
 *
 * See CARD_REGISTRY.md for the architecture and migration plan.
 */
export * from "./effects";
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
  getEffectiveTrigger,
  renderCardText,
  renderEffectBody,
  renderEffectText,
} from "./text";
