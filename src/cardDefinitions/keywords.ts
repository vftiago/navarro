import type { CardEffect } from "./card";
import { Keyword, TriggerMoment } from "./card";

export const KEYWORD_EFFECTS: Record<Keyword, CardEffect> = {
  [Keyword.CRASH]: {
    getActions: () => [],
    getText: () => `${Keyword.CRASH}.`,
    keyword: Keyword.CRASH,
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [Keyword.ETHEREAL]: {
    getActions: () => [],
    getText: () => `${Keyword.ETHEREAL}.`,
    keyword: Keyword.ETHEREAL,
    triggerMoment: TriggerMoment.ON_DISCARD,
  },
  [Keyword.TRASH]: {
    getActions: () => [],
    getText: () => `${Keyword.TRASH}.`,
    keyword: Keyword.TRASH,
    triggerMoment: TriggerMoment.ON_DISCARD,
  },
  [Keyword.UNPLAYABLE]: {
    getActions: () => [],
    getText: () => `${Keyword.UNPLAYABLE}.`,
    keyword: Keyword.UNPLAYABLE,
    triggerMoment: TriggerMoment.ON_PLAY,
  },
};
