import {
  CardEffectT,
  CardType,
  Keyword,
  PlayingCardT,
  TriggerMoment,
} from "../../cards/card";
import {
  createIcePlayingCard,
  createServerPlayingCard,
} from "../../cards/createPlayingCard";
import {
  weightedServerCards,
  weightedServerIceDeck,
} from "../../decks/serverStarterDeck";
import { GameState } from "../types";

export const shuffleCards = <T>(cards: T[]): T[] => {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const drawCardsFromDeck = ({
  deck,
  hand,
  discard,
  count,
}: {
  deck: PlayingCardT[];
  hand: PlayingCardT[];
  discard: PlayingCardT[];
  count: number;
}): {
  newDeck: PlayingCardT[];
  newHand: PlayingCardT[];
  newDiscard: PlayingCardT[];
} => {
  let remainingDeck = [...deck];
  let remainingDiscard = [...discard];
  let drawnCards = [...hand];

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
    newHand: drawnCards,
    newDiscard: remainingDiscard,
  };
};

export const discardHand = ({
  hand,
  discard,
  trash,
}: {
  hand: PlayingCardT[];
  discard: PlayingCardT[];
  trash: PlayingCardT[];
}): {
  newDiscard: PlayingCardT[];
  newTrash: PlayingCardT[];
} => {
  const newDiscard = [...discard];
  const newTrash = [...trash];

  for (const card of hand) {
    const shouldTrash = hasKeyword(card, Keyword.TRASH);

    if (shouldTrash) {
      newTrash.unshift(card);
    } else {
      newDiscard.unshift(card);
    }
  }

  return { newDiscard, newTrash };
};

export const playCardFromHand = ({
  hand,
  discard,
  trash,
  programs,
  card,
  cardIndex,
}: {
  hand: PlayingCardT[];
  discard: PlayingCardT[];
  trash: PlayingCardT[];
  programs: PlayingCardT[];
  card: PlayingCardT;
  cardIndex: number;
}): {
  newHand: PlayingCardT[];
  newDiscard: PlayingCardT[];
  newTrash: PlayingCardT[];
  newPrograms: PlayingCardT[];
  newPlayedCard: PlayingCardT[];
} => {
  const newHand = hand.filter((_, index) => index !== cardIndex);

  const isProgram = card.type === CardType.PROGRAM;

  const shouldTrash = card.cardEffects?.some(
    (effect) => effect.keyword === Keyword.TRASH,
  );

  const newDiscard = [...discard];
  const newTrash = [...trash];
  const newPrograms = [...programs];
  const newPlayedCard = [card];

  if (isProgram) {
    newPrograms.push(card);
  } else if (shouldTrash) {
    newTrash.push(card);
  } else {
    newDiscard.push(card);
  }

  return {
    newHand,
    newDiscard,
    newTrash,
    newPrograms,
    newPlayedCard,
  };
};

export const drawRandomServerCard = (): PlayingCardT => {
  return createServerPlayingCard(weightedServerCards.pick());
};

export const drawRandomIceCard = (): PlayingCardT => {
  return createIcePlayingCard(weightedServerIceDeck.pick());
};

export const applyCardEffects = (
  state: GameState,
  cardEffects: CardEffectT[],
  triggerMoment: TriggerMoment,
): GameState => {
  if (!cardEffects || cardEffects.length === 0) {
    return state;
  }

  let newState = { ...state };

  for (const effect of cardEffects) {
    if (effect.triggerMoment === triggerMoment) {
      newState = effect.callback(newState);
    }
  }

  return newState;
};

export const getCardEffectsByTrigger = (
  cards: PlayingCardT[],
  triggerMoment: TriggerMoment,
): CardEffectT[] => {
  return cards
    .flatMap((card) => card.cardEffects || [])
    .filter((effect) => effect.triggerMoment === triggerMoment);
};

export const hasKeyword = (card: PlayingCardT, keyword: Keyword): boolean => {
  return card.cardEffects?.some((effect) => effect.keyword === keyword);
};
