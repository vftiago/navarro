import type {
  IceCardDefinition,
  ProgramCardDefinition,
} from "../definitions/types";
/**
 * Breakers - The breaker key and the break check
 *
 * Subtype is only the breaker key (Mark II, "Ice and breakers"): fracters
 * break barriers, decoders break code gates, killers break sentries, AI
 * breaks anything. Strength is the threshold: a program breaks ice whose
 * current strength is not higher than its own. Breaking is structural — a
 * program breaks because it is a breaker, not because an effect says so —
 * and free; what it costs is printed on the breaker as its own subroutines.
 * Because the key is implicit in the subtype, no card prints it: the
 * subtype glyph's tooltip carries the reminder.
 */
import { IceSubtype, ProgramSubtype } from "../enums";

const BREAKER_KEY: Record<ProgramSubtype, IceSubtype[]> = {
  [ProgramSubtype.AI]: [
    IceSubtype.BARRIER,
    IceSubtype.CODE_GATE,
    IceSubtype.SENTRY,
  ],
  [ProgramSubtype.DECODER]: [IceSubtype.CODE_GATE],
  [ProgramSubtype.FRACTER]: [IceSubtype.BARRIER],
  [ProgramSubtype.KILLER]: [IceSubtype.SENTRY],
  [ProgramSubtype.RESOURCE]: [],
};

/** The ice subtypes a breaker subtype answers; empty for utilities */
export const getBreakerTargets = (subtype: ProgramSubtype): IceSubtype[] =>
  BREAKER_KEY[subtype];

/** A breaker is a program with a breaker subtype and a printed strength */
export const isBreaker = (definition: ProgramCardDefinition): boolean =>
  definition.strength !== undefined &&
  getBreakerTargets(definition.subtype).length > 0;

/**
 * Whether a program breaks an ice at its current strength. The caller
 * supplies the strength since modifiers (stacked buffs, security scaling) live in
 * game state, which the engine does not read.
 */
export const canBreakIce = (
  program: ProgramCardDefinition,
  ice: IceCardDefinition,
  iceStrength: number,
): boolean =>
  program.strength !== undefined &&
  getBreakerTargets(program.subtype).includes(ice.subtype) &&
  program.strength >= iceStrength;

/** The breaker subtypes that answer an ice subtype (AI always among them) */
export const getBreakersFor = (subtype: IceSubtype): ProgramSubtype[] =>
  (Object.keys(BREAKER_KEY) as ProgramSubtype[]).filter((breaker) =>
    BREAKER_KEY[breaker].includes(subtype),
  );

const isIceSubtype = (
  subtype: IceSubtype | ProgramSubtype,
): subtype is IceSubtype =>
  (Object.values(IceSubtype) as string[]).includes(subtype);

/** Plural forms for the reminder sentence; AI is uncountable and reads last */
const PLURALS: Record<IceSubtype | ProgramSubtype, string> = {
  [IceSubtype.BARRIER]: "barriers",
  [IceSubtype.CODE_GATE]: "code gates",
  [IceSubtype.SENTRY]: "sentries",
  [ProgramSubtype.AI]: "AI",
  [ProgramSubtype.DECODER]: "decoders",
  [ProgramSubtype.FRACTER]: "fracters",
  [ProgramSubtype.KILLER]: "killers",
  [ProgramSubtype.RESOURCE]: "resources",
};

const listPlural = (subtypes: (IceSubtype | ProgramSubtype)[]): string =>
  [...subtypes]
    .sort((a, b) =>
      a === ProgramSubtype.AI ? 1 : b === ProgramSubtype.AI ? -1 : 0,
    )
    .map((subtype) => PLURALS[subtype])
    .join(" and ");

/**
 * Reminder text for a subtype: what a breaker breaks, or what breaks an
 * ice. The breaker key is implicit in the subtype, so this lives on the
 * subtype glyph's tooltip rather than in any card's rules text. Undefined
 * for subtypes outside the key (utilities).
 */
export const getSubtypeReminderText = (
  subtype: IceSubtype | ProgramSubtype,
): string | undefined => {
  if (isIceSubtype(subtype)) {
    return `Broken by ${listPlural(getBreakersFor(subtype))}.`;
  }
  if (subtype === ProgramSubtype.AI) {
    return "Breaks any ice.";
  }
  const targets = getBreakerTargets(subtype);

  return targets.length > 0 ? `Breaks ${listPlural(targets)}.` : undefined;
};
