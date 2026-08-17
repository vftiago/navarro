/**
 * Keyword Registry - Keywords as mechanics, defined once
 *
 * A keyword is a named, reusable bundle of behavior: triggered effects
 * (`grants`, merged into the card's effect list at resolution time) and/or
 * static rule-flags (`flags`, queried by the engine via `hasKeywordFlag`
 * instead of per-keyword special-casing in phase logic).
 *
 * Adding a keyword = one entry here. If it's a static rule the engine
 * doesn't know yet, add one flag check at the relevant spot — once, not
 * per card.
 */
import { Keyword } from "../../cardDefinitions/card";
import type { EffectSpec } from "./effects/types";

/**
 * Static rule-flags a keyword can contribute
 */
export type KeywordFlags = {
  /** Playing this card generates no noise */
  noNoiseOnPlay?: boolean;
  /** After being played, the card goes to the trash pile instead of discard */
  trashAfterPlay?: boolean;
  /** When discarded from hand, the card goes to the trash pile instead of discard */
  trashOnHandDiscard?: boolean;
  /** The card cannot be played from hand */
  unplayable?: boolean;
};

export type KeywordDefinition = {
  flags?: KeywordFlags;
  /** Triggered effects this keyword contributes to the card */
  grants?: EffectSpec[];
  id: Keyword;
  /** Parenthetical rules reminder shown in tooltips */
  reminderText: string;
};

export const keywordRegistry: Record<Keyword, KeywordDefinition> = {
  [Keyword.ETHEREAL]: {
    flags: { trashOnHandDiscard: true },
    id: Keyword.ETHEREAL,
    reminderText: "(Goes to the trash when discarded from your hand.)",
  },
  [Keyword.STEALTHY]: {
    flags: { noNoiseOnPlay: true },
    id: Keyword.STEALTHY,
    reminderText: "(Generates no noise when played.)",
  },
  [Keyword.TRASH]: {
    flags: { trashAfterPlay: true },
    id: Keyword.TRASH,
    reminderText: "(Goes to the trash after being played.)",
  },
  [Keyword.UNPLAYABLE]: {
    flags: { unplayable: true },
    id: Keyword.UNPLAYABLE,
    reminderText: "(Cannot be played.)",
  },
};

export const getKeywordDefinition = (keyword: Keyword): KeywordDefinition => {
  return keywordRegistry[keyword];
};

/**
 * Whether any of the card's keywords contributes the given rule-flag
 */
export const hasKeywordFlag = (
  keywords: Keyword[] | undefined,
  flag: keyof KeywordFlags,
): boolean => {
  return (keywords ?? []).some(
    (keyword) => keywordRegistry[keyword].flags?.[flag] === true,
  );
};

/**
 * All effects granted by the given keywords
 */
export const getKeywordGrants = (
  keywords: Keyword[] | undefined,
): EffectSpec[] => {
  return (keywords ?? []).flatMap(
    (keyword) => keywordRegistry[keyword].grants ?? [],
  );
};
