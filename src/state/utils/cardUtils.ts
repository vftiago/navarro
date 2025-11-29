import {
  CardEffect,
  IcePlayingCard,
  Keyword,
  PlayingCard,
  TriggerMoment,
} from "../../cardDefinitions/card";
import {
  createIcePlayingCard,
  createServerPlayingCard,
} from "../../cardDefinitions/createPlayingCard";
import {
  weightedServerCards,
  weightedServerIce,
} from "../../decks/serverStarterDeck";

export const getRandomServerCard = (): PlayingCard => {
  return createServerPlayingCard(weightedServerCards.pick());
};

export const getRandomIceCard = (): IcePlayingCard => {
  return createIcePlayingCard(weightedServerIce.pick());
};

export const getCardEffectsByTrigger = (
  card: PlayingCard,
  triggerMoment: TriggerMoment,
): CardEffect[] => {
  return card.cardEffects.filter(
    (effect) => effect.triggerMoment === triggerMoment,
  );
};

export const hasKeyword = (card: PlayingCard, keyword: Keyword): boolean => {
  return card.cardEffects?.some((effect) => effect.keyword === keyword);
};
