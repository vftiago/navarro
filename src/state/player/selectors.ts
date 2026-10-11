import type { CardInstance } from "../../cards/instance";
import type { GameState } from "../types";

export const getPlayerHand = (state: GameState): CardInstance[] =>
  state.playerState.playerHand;

export const getPlayerDeck = (state: GameState): CardInstance[] =>
  state.playerState.playerDeck;

export const getPlayerDiscardPile = (state: GameState): CardInstance[] =>
  state.playerState.playerDiscardPile;

export const getPlayerTrashPile = (state: GameState): CardInstance[] =>
  state.playerState.playerTrashPile;

export const getPlayerScoreArea = (state: GameState): CardInstance[] =>
  state.playerState.playerScoreArea;

export const getPlayerInstalledPrograms = (state: GameState): CardInstance[] =>
  state.playerState.playerInstalledPrograms;

/**
 * Memory: every installed program occupies MU, and a program can only be
 * installed while there is room for it. For now every program costs one MU;
 * when it becomes a printed stat this constant becomes a definition lookup.
 */
export const PROGRAM_MEMORY_COST = 1;

/** Memory capacity in MU */
export const getPlayerMemory = (state: GameState): number =>
  state.playerState.playerMemory;

/** MU occupied by installed programs */
export const getPlayerMemoryUsed = (state: GameState): number =>
  state.playerState.playerInstalledPrograms.length * PROGRAM_MEMORY_COST;

/** Whether one more program fits in the rig */
export const canInstallProgram = (state: GameState): boolean =>
  getPlayerMemoryUsed(state) + PROGRAM_MEMORY_COST <= getPlayerMemory(state);

export const getPlayerMaxHandSize = (state: GameState): number =>
  state.playerState.playerMaxHandSize;

export const getPlayerPlayedCards = (state: GameState): CardInstance[] =>
  state.playerState.playerPlayedCards;

export const getPlayerAccessedCards = (state: GameState): CardInstance[] =>
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

export const getAccessedCards = (state: GameState): CardInstance[] =>
  state.playerState.playerAccessedCards;
