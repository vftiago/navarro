import {
  IcePlayingCardT,
  Keyword,
  PlayingCardT,
  TriggerMoment,
} from "../cards/card";
import { GameState, GamePhase } from "./types";

export const getTurnRemainingClicks = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getTurnCurrentPhase = (state: GameState): GamePhase =>
  state.turnState.turnPhase;

export const getServerSecurityLevel = (state: GameState): number =>
  state.serverState.serverSecurityLevel;

export const getCurrentTurn = (state: GameState): number =>
  state.turnState.turnNumber;

export const getCurrentClick = (state: GameState): number =>
  state.turnState.turnRemainingClicks;

export const getNextAction = (state: GameState) =>
  state.turnState.turnNextAction;

export const getPlayerHand = (state: GameState): PlayingCardT[] =>
  state.playerState.playerHand;

export const getPlayerDeck = (state: GameState): PlayingCardT[] =>
  state.playerState.playerDeck;

export const getPlayerDiscardPile = (state: GameState): PlayingCardT[] =>
  state.playerState.playerDiscardPile;

export const getPlayerTrashPile = (state: GameState): PlayingCardT[] =>
  state.playerState.playerTrashPile;

export const getPlayerScoreArea = (state: GameState): PlayingCardT[] =>
  state.playerState.playerScoreArea;

export const getPlayerInstalledPrograms = (state: GameState): PlayingCardT[] =>
  state.playerState.playerInstalledPrograms;

export const getPlayerMaxHandSize = (state: GameState): number =>
  state.playerState.playerMaxHandSize;

export const getPlayerCardsPerTurn = (state: GameState): number =>
  state.playerState.playerMaxHandSize;

export const getPlayerClicksPerTurn = (state: GameState): number =>
  state.playerState.playerClicksPerTurn;

export const getPlayerTags = (state: GameState): number =>
  state.playerState.playerTags;

export const getPlayerVictoryPoints = (state: GameState): number =>
  state.playerState.playerVictoryPoints;

export const getServerInstalledIce = (state: GameState): IcePlayingCardT[] =>
  state.serverState.serverInstalledIce;

export const getServerRezzedIce = (state: GameState): IcePlayingCardT[] =>
  state.serverState.serverInstalledIce.filter((ice) => ice.isRezzed);

export const getServerDeck = (state: GameState): PlayingCardT[] =>
  state.serverState.sevrerDeck;

export const getAccessedCards = (state: GameState): PlayingCardT[] =>
  state.transitoryState.transitoryAccessedCards;

export const canPlayCards = (state: GameState): boolean =>
  state.turnState.turnPhase === GamePhase.Main &&
  state.turnState.turnRemainingClicks > 0;

export const canAccessServer = (state: GameState): boolean =>
  state.turnState.turnPhase === GamePhase.Main &&
  state.turnState.turnRemainingClicks > 0;

export const getIceStrength = (
  state: GameState,
  iceCard: IcePlayingCardT,
): number => {
  let strength = iceCard.getStrength(state);

  state.serverState.serverInstalledIce.forEach((otherIce) => {
    if (otherIce.deckContextId !== iceCard.deckContextId && otherIce.isRezzed) {
      // Check for permanent effects that might boost strength
      const boostEffects = otherIce.cardEffects?.filter(
        (effect) =>
          effect.triggerMoment === TriggerMoment.PERMANENT &&
          effect.keyword === Keyword.BOOST,
      );

      if (boostEffects && boostEffects.length > 0) {
        strength += 1;
      }
    }
  });

  return strength;
};
