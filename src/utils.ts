import { PlayingCardT, TriggerMoment } from "./cards/card";
import { GameState } from "./state/gameReducer";

export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const applyEffects = (
  initialGameState: GameState,
  cardEffects: PlayingCardT["cardEffects"],
  triggerMoment: TriggerMoment,
): GameState => {
  const newGameState = cardEffects?.reduce((gameState, effect) => {
    if (effect.triggerMoment === triggerMoment) {
      return effect.callback(gameState);
    }

    return gameState;
  }, initialGameState);

  return newGameState ?? initialGameState;
};
