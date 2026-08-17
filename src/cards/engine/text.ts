import type { CardDefinition } from "../definitions/types";
/**
 * Text Generation - Rules text derived from effect data
 *
 * Text is generated from the same params that drive behavior, so the two
 * can never drift apart. Precedence: card-level `text` override >
 * per-effect `text` override > generated.
 */
import type { Keyword } from "../enums";
import { TriggerMoment } from "../enums";
import { getConditionImplementation } from "./effects/conditions";
import { getEffectImplementation } from "./effects/registry";
import type {
  ConditionImplementation,
  ConditionSpec,
  EffectImplementation,
  EffectSpec,
} from "./effects/types";
import { getKeywordDefinition } from "./keywords";
import { resolveEffectSpecs } from "./resolve";

/**
 * Human-readable labels for triggers that merit a textual prefix.
 *
 * Intentionally unlabeled: ON_PLAY (the default reading of a card) and
 * ON_ENCOUNTER (rendered as a subroutine marker by the UI).
 */
const TRIGGER_LABELS: Partial<Record<TriggerMoment, string>> = {
  [TriggerMoment.ON_ACCESS]: "On Access",
  [TriggerMoment.ON_DISCARD]: "On Discard",
  [TriggerMoment.ON_DRAW]: "On Draw",
  [TriggerMoment.ON_FETCH]: "On Fetch",
  [TriggerMoment.ON_INSTALL]: "On Install",
  [TriggerMoment.ON_REZ]: "On Rez",
  [TriggerMoment.ON_RUN_END]: "On Run End",
  [TriggerMoment.ON_RUN_START]: "On Run Start",
  [TriggerMoment.ON_TRASH]: "On Trash",
  [TriggerMoment.ON_UPKEEP]: "On Upkeep",
};

const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const lowercaseFirst = (text: string): string => {
  return text.charAt(0).toLowerCase() + text.slice(1);
};

export const getEffectiveTrigger = (spec: EffectSpec): TriggerMoment => {
  return spec.trigger ?? getEffectImplementation(spec.effect).defaultTrigger;
};

/**
 * A trigger label is shown only when the spec deviates from the
 * implementation's default trigger (and the trigger merits a label at all).
 */
const getTriggerLabel = (spec: EffectSpec): string | undefined => {
  const trigger = getEffectiveTrigger(spec);
  if (trigger === getEffectImplementation(spec.effect).defaultTrigger) {
    return undefined;
  }
  return TRIGGER_LABELS[trigger];
};

const getConditionText = (condition: ConditionSpec): string => {
  // Erase the per-id params link; ConditionSpec guaranteed the match
  const impl = getConditionImplementation(
    condition.check,
  ) as ConditionImplementation<unknown>;
  return impl.getText(condition.params);
};

/**
 * The effect sentence without its trigger label,
 * e.g. "If the server security level is 3 or more, end the run."
 */
export const renderEffectBody = (spec: EffectSpec): string => {
  if (spec.text) {
    return spec.text;
  }
  // Erase the per-id params link; EffectSpec guaranteed the match
  const impl = getEffectImplementation(
    spec.effect,
  ) as EffectImplementation<unknown>;
  const effectText = impl.getText(spec.params);
  if (!spec.condition) {
    return effectText;
  }
  return `${capitalizeFirst(getConditionText(spec.condition))}, ${lowercaseFirst(effectText)}`;
};

/**
 * The full text for a single effect, trigger label included,
 * e.g. "On Upkeep: Draw 1 card."
 */
export const renderEffectText = (spec: EffectSpec): string => {
  if (spec.text) {
    return spec.text;
  }
  const label = getTriggerLabel(spec);
  const body = renderEffectBody(spec);
  return label ? `${label}: ${body}` : body;
};

/**
 * One rendered line of a card's rules text, with the metadata the UI
 * needs to style it (subroutine marker, keyword tooltip)
 */
export type CardTextLine = {
  /** Render with the subroutine marker (ON_ENCOUNTER effects) */
  isSubroutine?: boolean;
  /** Set for keyword lines — style distinctly, tooltip the reminder */
  keyword?: Keyword;
  reminderText?: string;
  text: string;
};

/**
 * All rules-text lines for a card: keyword lines first, then effect lines
 * (printed and implicit — e.g. an agenda's derived "Score N.").
 *
 * Consecutive effects sharing the same labeled trigger are grouped under a
 * single label: "On Upkeep: Draw 1 card. Lose 1 click." A card-level `text`
 * override replaces the effect lines (keyword lines always render).
 */
export const getCardTextLines = (
  definition: CardDefinition,
): CardTextLine[] => {
  const lines: CardTextLine[] = (definition.keywords ?? []).map((keyword) => ({
    keyword,
    reminderText: getKeywordDefinition(keyword).reminderText,
    text: `${keyword}.`,
  }));

  if (definition.text) {
    lines.push({ text: definition.text });
    return lines;
  }

  const specs = resolveEffectSpecs(definition);
  let index = 0;
  while (index < specs.length) {
    const spec = specs[index];
    const label = getTriggerLabel(spec);
    if (!label) {
      lines.push({
        text: renderEffectText(spec),
        ...(getEffectiveTrigger(spec) === TriggerMoment.ON_ENCOUNTER && {
          isSubroutine: true,
        }),
      });
      index += 1;
      continue;
    }

    const trigger = getEffectiveTrigger(spec);
    const bodies = [renderEffectBody(spec)];
    index += 1;
    while (
      index < specs.length &&
      !specs[index].text &&
      getEffectiveTrigger(specs[index]) === trigger &&
      getTriggerLabel(specs[index]) === label
    ) {
      bodies.push(renderEffectBody(specs[index]));
      index += 1;
    }
    lines.push({ text: `${label}: ${bodies.join(" ")}` });
  }

  return lines;
};

/**
 * A card's full rules text as plain strings
 */
export const renderCardText = (definition: CardDefinition): string[] => {
  return getCardTextLines(definition).map((line) => line.text);
};
