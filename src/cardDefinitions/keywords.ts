import { CardEffect, Keyword, TriggerMoment } from "./card";

export const KEYWORD_EFFECTS: Record<Keyword, CardEffect> = {
  [Keyword.UNPLAYABLE]: {
    triggerMoment: TriggerMoment.ON_PLAY,
    keyword: Keyword.UNPLAYABLE,
    getActions: () => [],
    getText: () => `${Keyword.UNPLAYABLE}.`,
  },
  [Keyword.ETHEREAL]: {
    triggerMoment: TriggerMoment.ON_DISCARD,
    keyword: Keyword.ETHEREAL,
    getActions: () => [],
    getText: () => `${Keyword.ETHEREAL}.`,
  },
  [Keyword.CRASH]: {
    triggerMoment: TriggerMoment.ON_PLAY,
    keyword: Keyword.CRASH,
    getActions: () => [],
    getText: () => `${Keyword.CRASH}.`,
  },
  [Keyword.TRASH]: {
    triggerMoment: TriggerMoment.ON_DISCARD,
    keyword: Keyword.TRASH,
    getActions: () => [],
    getText: () => `${Keyword.TRASH}.`,
  },
};
