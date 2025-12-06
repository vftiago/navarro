import {
  type CardEffect,
  type IcePlayingCard,
  type Keyword,
  type PlayingCard,
  type TriggerMoment,
} from "../../cardDefinitions/card";
import {
  createIcePlayingCard,
  createServerPlayingCard,
} from "../../cardDefinitions/createPlayingCard";
import {
  weightedServerCards,
  weightedServerIce,
} from "../../decks/serverStarterDeck";
import type { GameAction, GameState } from "../types";

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

/**
 * Executes card effects, handling both action-based and thunk-based effects
 * @param effects - Array of card effects to execute
 * @param dispatch - Dispatch function for actions
 * @param getState - Function to get current game state
 * @param params - Parameters to pass to getActions/getThunk
 */
export const executeCardEffects = (
  effects: CardEffect[],
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
  params: {
    gameState: GameState;
    sourceId?: string;
    targetId?: string;
  },
): void => {
  effects.forEach((effect) => {
    if (effect.getThunk) {
      // Execute thunk by calling it with dispatch and getState
      const thunk = effect.getThunk(params);
      thunk(dispatch, getState);
    } else if (effect.getActions) {
      // Execute actions
      const actions = effect.getActions(params);
      actions.forEach(dispatch);
    }
  });
};

/**
 * Helper to execute trigger effects for a specific card and trigger moment
 * @param card - The card whose effects to execute
 * @param triggerMoment - The trigger moment to filter by
 * @param dispatch - Dispatch function
 * @param getState - Function to get current game state
 */
export const executeCardTriggers = (
  card: PlayingCard,
  triggerMoment: TriggerMoment,
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
): void => {
  const effects = getCardEffectsByTrigger(card, triggerMoment);
  executeCardEffects(effects, dispatch, getState, {
    gameState: getState(),
    sourceId: card.deckContextId,
  });
};
