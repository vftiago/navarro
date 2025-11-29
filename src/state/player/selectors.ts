import { PlayingCard } from "../../cardDefinitions/card";
import { GameState } from "../reducer";

export const getPlayerHand = (state: GameState): PlayingCard[] =>
  state.playerState.playerHand;

export const getPlayerDeck = (state: GameState): PlayingCard[] =>
  state.playerState.playerDeck;

export const getPlayerDiscardPile = (state: GameState): PlayingCard[] =>
  state.playerState.playerDiscardPile;

export const getPlayerTrashPile = (state: GameState): PlayingCard[] =>
  state.playerState.playerTrashPile;

export const getPlayerScoreArea = (state: GameState): PlayingCard[] =>
  state.playerState.playerScoreArea;

export const getPlayerInstalledPrograms = (state: GameState): PlayingCard[] =>
  state.playerState.playerInstalledPrograms;

export const getPlayerMaxHandSize = (state: GameState): number =>
  state.playerState.playerMaxHandSize;

export const getPlayerPlayedCards = (state: GameState): PlayingCard[] =>
  state.playerState.playerPlayedCards;

export const getPlayerAccessedCards = (state: GameState): PlayingCard[] =>
  state.playerState.playerAccessedCards;

export const getPlayerCardsPerTurn = (state: GameState): number => {
  const baseStat = state.playerState.playerCardsPerTurn;

  const relevantEffects = state.boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getPlayerCardsPerTurn",
  );

  const modifier = relevantEffects.reduce((acc, { getModifier }) => {
    const modifier = getModifier({
      gameState: state,
    });

    return acc + modifier;
  }, 0);

  return baseStat + modifier;
};

export const getPlayerClicksPerTurn = (state: GameState): number =>
  state.playerState.playerClicksPerTurn;

export const getPlayerTags = (state: GameState): number =>
  state.playerState.playerTags;

export const getPlayerVictoryPoints = (state: GameState): number =>
  state.playerState.playerVictoryPoints;

export const getAccessedCards = (state: GameState): PlayingCard[] =>
  state.playerState.playerAccessedCards;
