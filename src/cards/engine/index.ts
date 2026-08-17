/**
 * Card Engine - Effects, conditions, and text generation
 *
 * See CARD_REGISTRY.md for the architecture and migration plan.
 */
export * from "./effects";
export { getImplicitEffects, resolveEffectSpecs } from "./resolve";
export {
  getEffectiveTrigger,
  renderCardText,
  renderEffectBody,
  renderEffectText,
} from "./text";
