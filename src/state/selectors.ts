import { IcePlayingCard, PlayingCard } from "../cardDefinitions/card";
import { GameState } from "./reducer";
import { TurnPhase, TurnSubPhase } from "./reducers/turnReducer";

const CARD_SIZES = {
  xs: {
    h: "18rem",
    w: "12rem",
  },
};

// TODO: move selectors closer to the reducers they are related to
export const getCardSize = (
  state: GameState,
): {
  h: string;
  w: string;
} => CARD_SIZES[state.optionsState.cardSize];

export const getTurnRemainingClicks = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getTurnCurrentPhase = (state: GameState): TurnPhase =>
  state.turnState.turnCurrentPhase;

export const getTurnCurrentSubPhase = (state: GameState): TurnSubPhase =>
  state.turnState.turnCurrentSubPhase;

export const getTurnNextPhase = (state: GameState): null | TurnPhase =>
  state.turnState.turnNextPhase;

export const getServerSecurityLevel = (state: GameState): number =>
  state.serverState.serverSecurityLevel;

export const getCurrentTurn = (state: GameState): number =>
  state.turnState.turnNumber;

export const getCurrentClick = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

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

export const getServerInstalledIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverInstalledIce;

export const getServerUnencounteredIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverUnencounteredIce;

export const getServerRezzedIce = (state: GameState): IcePlayingCard[] =>
  state.serverState.serverInstalledIce.filter((ice) => ice.isRezzed);

export const getAccessedCards = (state: GameState): PlayingCard[] =>
  state.playerState.playerAccessedCards;

export const getIceStrength = (
  state: GameState,
  iceCard: IcePlayingCard,
): number => {
  const baseStrength = iceCard.getStrength(state);
  const targetId = iceCard.deckContextId;

  const relevantEffects = state.boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getIceStrength",
  );

  const modifier = relevantEffects.reduce((acc, { sourceId, getModifier }) => {
    const modifier = getModifier({
      gameState: state,
      sourceId,
      targetId,
    });

    return acc + modifier;
  }, 0);

  return baseStrength + modifier;
};
