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
import { Keyword } from "../enums";
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

export type KeywordTextPlacement = "after" | "before";

export type KeywordDefinition = {
  flags?: KeywordFlags;
  /** Triggered effects this keyword contributes to the card */
  grants?: EffectSpec[];
  id: Keyword;
  /** Parenthetical rules reminder shown in tooltips */
  reminderText: string;
  /**
   * Where the keyword line renders relative to the effect lines (purely
   * presentational). Keywords that are consequences of playing the card
   * (e.g. Trash) read after the effects; defaults to "before".
   */
  textPlacement?: KeywordTextPlacement;
};

export const keywordRegistry: Record<Keyword, KeywordDefinition> = {
  [Keyword.ADAPTIVE_STRENGTH]: {
    grants: [{ effect: "strength_per_server_security" }],
    id: Keyword.ADAPTIVE_STRENGTH,
    reminderText: "(Strength is equal to the server security level.)",
  },
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
    textPlacement: "after",
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
