import { CardEffectT, Keyword, TriggerMoment } from "./card";

export const KEYWORD_EFFECTS: Record<Keyword, CardEffectT> = {
  [Keyword.UNPLAYABLE]: {
    triggerMoment: TriggerMoment.ON_PLAY,
    keyword: Keyword.UNPLAYABLE,
    callback: (gameState) => gameState,
    getText: () => `${Keyword.UNPLAYABLE}.`,
  },
  [Keyword.ETHEREAL]: {
    triggerMoment: TriggerMoment.ON_DISCARD,
    keyword: Keyword.ETHEREAL,
    callback: (gameState) => gameState,
    getText: () => `${Keyword.ETHEREAL}.`,
  },
  [Keyword.CRASH]: {
    triggerMoment: TriggerMoment.ON_PLAY,
    keyword: Keyword.CRASH,
    callback: (gameState) => gameState,
    getText: () => `${Keyword.CRASH}.`,
  },
  [Keyword.TRASH]: {
    triggerMoment: TriggerMoment.ON_DISCARD,
    keyword: Keyword.TRASH,
    callback: (gameState) => gameState,
    getText: () => `${Keyword.TRASH}.`,
  },
};
