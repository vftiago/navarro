import {
  CardEffect,
  IcePlayingCard,
  Keyword,
  PlayingCard,
  TriggerMoment,
} from "../cardDefinitions/card";
import {
  createIcePlayingCard,
  createServerPlayingCard,
} from "../cardDefinitions/createPlayingCard";
import {
  weightedServerCards,
  weightedServerIce,
} from "../decks/serverStarterDeck";

export const shuffleCards = <T>(cards: T[]): T[] => {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const drawCardsFromDeck = ({
  count,
  deck,
  discard,
  hand,
}: {
  deck: PlayingCard[];
  hand: PlayingCard[];
  discard: PlayingCard[];
  count: number;
}): {
  newDeck: PlayingCard[];
  newHand: PlayingCard[];
  newDiscard: PlayingCard[];
} => {
  let remainingDeck: PlayingCard[] = [...deck];
  let remainingDiscard: PlayingCard[] = [...discard];
  let drawnCards: PlayingCard[] = [...hand];

  while (drawnCards.length < hand.length + count) {
    if (remainingDeck.length === 0) {
      if (remainingDiscard.length === 0) {
        break;
      }
      remainingDeck = shuffleCards(remainingDiscard);
      remainingDiscard = [];
    }

    const drawCount = Math.min(
      count - (drawnCards.length - hand.length),
      remainingDeck.length,
    );

    drawnCards = drawnCards.concat(remainingDeck.slice(0, drawCount));
    remainingDeck = remainingDeck.slice(drawCount);
  }

  return {
    newDeck: remainingDeck,
    newDiscard: remainingDiscard,
    newHand: drawnCards,
  };
};

export const discardHand = ({
  discard,
  hand,
  trash,
}: {
  hand: PlayingCard[];
  discard: PlayingCard[];
  trash: PlayingCard[];
}): {
  newDiscard: PlayingCard[];
  newTrash: PlayingCard[];
} => {
  const newDiscard = [...discard];
  const newTrash = [...trash];

  for (const card of hand) {
    const shouldTrash = hasKeyword(card, Keyword.ETHEREAL);

    if (shouldTrash) {
      newTrash.unshift(card);
    } else {
      newDiscard.unshift(card);
    }
  }

  return { newDiscard, newTrash };
};

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
