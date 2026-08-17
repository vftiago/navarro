import { hasKeywordFlag } from "../../cards/engine";
import type { CardInstance } from "../../cards/instance";
import { resolveCard } from "../../cards/instance";

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
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  count: number;
}): {
  newDeck: CardInstance[];
  newHand: CardInstance[];
  newDiscard: CardInstance[];
} => {
  let remainingDeck: CardInstance[] = [...deck];
  let remainingDiscard: CardInstance[] = [...discard];
  let drawnCards: CardInstance[] = [...hand];

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
  hand: CardInstance[];
  discard: CardInstance[];
  trash: CardInstance[];
}): {
  newDiscard: CardInstance[];
  newTrash: CardInstance[];
} => {
  const newDiscard = [...discard];
  const newTrash = [...trash];

  for (const card of hand) {
    const shouldTrash = hasKeywordFlag(
      resolveCard(card).keywords,
      "trashOnHandDiscard",
    );

    if (shouldTrash) {
      newTrash.unshift(card);
    } else {
      newDiscard.unshift(card);
    }
  }

  return { newDiscard, newTrash };
};
