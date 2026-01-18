import { CardType, TriggerMoment } from "../../cardDefinitions/card";
import {
  addToAccessedCards,
  addToDiscard,
  addToScoreArea,
  clearAccessedCards,
  getPlayerInstalledPrograms,
} from "../player";
import {
  addToUnencounteredIce,
  clearUnencounteredIce,
  getServerUnencounteredIce,
  removeFromUnencounteredIce,
  setCurrentEncounteredIce,
} from "../server";
import {
  RunProgressState,
  setRunProgressState,
  setTurnCurrentPhase,
  TurnPhase,
} from "../turn";
import type { GameAction, GameState, ThunkAction } from "../types";
import {
  executeCardEffects,
  executeCardTriggers,
  getCardEffectsByTrigger,
  getRandomServerCard,
} from "../utils";

/**
 * Initiates a run - called by event handler when user clicks Run button.
 * Triggers ON_RUN_START, sets up ice for selected server, and determines first step.
 */
export const initiateRun = (): ThunkAction => {
  return (dispatch, getState) => {
    // Set phase to Run (this is the canonical place where Run phase starts)
    dispatch(setTurnCurrentPhase(TurnPhase.Run));

    const state = getState();
    const programs = getPlayerInstalledPrograms(state);

    // Trigger ON_RUN_START effects
    programs.forEach((card) => {
      const effects = getCardEffectsByTrigger(card, TriggerMoment.ON_RUN_START);
      executeCardEffects(effects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    // Initialize unencountered ice with ice from selected server (innermost to outermost)
    const { selectedServer, servers } = state.serverState;
    const ice = servers[selectedServer].installedIce;
    [...ice].reverse().forEach((iceCard) => {
      dispatch(addToUnencounteredIce(iceCard));
    });

    // Determine first step
    const unencounteredIce = getServerUnencounteredIce(getState());
    if (unencounteredIce.length > 0) {
      // Set first ice as current
      dispatch(setCurrentEncounteredIce(unencounteredIce[0]));
      dispatch(setRunProgressState(RunProgressState.ENCOUNTERING_ICE));
    } else {
      // No ice, go straight to access
      transitionToAccess(dispatch, getState);
    }
  };
};

export type ClickIcePayload = {
  iceId: string;
};

/**
 * Handles ice click during encounter - called by event handler.
 * Triggers ON_ENCOUNTER, removes ice, and advances to next ice or access.
 */
export const clickIce = (payload: ClickIcePayload): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const currentIce = state.serverState.serverCurrentEncounteredIce;

    if (!currentIce || currentIce.deckContextId !== payload.iceId) {
      console.error("clickIce: Ice mismatch in payload");
      return;
    }

    // Trigger ON_ENCOUNTER effects
    const encounterEffects = getCardEffectsByTrigger(
      currentIce,
      TriggerMoment.ON_ENCOUNTER,
    );
    executeCardEffects(encounterEffects, dispatch, getState, {
      gameState: getState(),
      sourceId: currentIce.deckContextId,
    });

    // Check if the run was ended by an encounter effect (e.g., "End the run")
    if (getState().turnState.runProgressState === RunProgressState.NOT_IN_RUN) {
      return;
    }

    // Remove from unencountered list
    dispatch(removeFromUnencounteredIce(currentIce));

    // Check for more ice
    const remainingIce = getServerUnencounteredIce(getState());
    if (remainingIce.length > 0) {
      // Set next ice as current
      dispatch(setCurrentEncounteredIce(remainingIce[0]));
    } else {
      // No more ice, transition to access
      dispatch(setCurrentEncounteredIce(null));
      transitionToAccess(dispatch, getState);
    }
  };
};

export type SelectAccessedCardPayload = {
  cardId: string;
};

/**
 * Handles card selection during access - called by event handler.
 * Triggers ON_FETCH, moves card to zone, triggers ON_RUN_END, and transitions phase.
 */
export const selectAccessedCard = (
  payload: SelectAccessedCardPayload,
): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedCard = state.playerState.playerAccessedCards.find(
      (card) => card.deckContextId === payload.cardId,
    );

    if (!selectedCard) {
      console.error("selectAccessedCard: Card not found in accessed cards");
      return;
    }

    // Trigger ON_FETCH effects
    const fetchEffects = getCardEffectsByTrigger(
      selectedCard,
      TriggerMoment.ON_FETCH,
    );
    executeCardEffects(fetchEffects, dispatch, getState, {
      gameState: getState(),
      sourceId: selectedCard.deckContextId,
    });

    // Move card to appropriate zone
    if (selectedCard.type === CardType.AGENDA) {
      dispatch(addToScoreArea(selectedCard));
    } else {
      executeCardTriggers(
        selectedCard,
        TriggerMoment.ON_DISCARD,
        dispatch,
        getState,
      );
      dispatch(addToDiscard(selectedCard));
    }

    // Clear accessed cards
    dispatch(clearAccessedCards());

    // Trigger ON_RUN_END (run is complete!)
    const endPrograms = getPlayerInstalledPrograms(getState());
    endPrograms.forEach((card) => {
      const runEndEffects = getCardEffectsByTrigger(
        card,
        TriggerMoment.ON_RUN_END,
      );
      executeCardEffects(runEndEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    // Reset run state
    dispatch(setRunProgressState(RunProgressState.NOT_IN_RUN));

    // Transition to Main or End based on clicks
    const clicks = getState().turnState.turnRemainingClicks;
    if (clicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }
  };
};

/**
 * Helper to transition to access phase - generates accessed cards and triggers ON_ACCESS.
 */
const transitionToAccess = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => {
  const accessedCards = [
    getRandomServerCard(),
    getRandomServerCard(),
    getRandomServerCard(),
  ];
  dispatch(addToAccessedCards(accessedCards));

  // Trigger ON_ACCESS effects on all accessed cards
  accessedCards.forEach((card) => {
    const accessEffects = getCardEffectsByTrigger(
      card,
      TriggerMoment.ON_ACCESS,
    );
    executeCardEffects(accessEffects, dispatch, getState, {
      gameState: getState(),
      sourceId: card.deckContextId,
    });
  });

  dispatch(setRunProgressState(RunProgressState.ACCESSING_CARDS));
};

/**
 * Ends the run immediately - used by "End the run" subroutines.
 * Clears run state and transitions back to Main or End phase.
 */
export const endRun = (): ThunkAction => {
  return (dispatch, getState) => {
    // Clear current ice and unencountered ice
    dispatch(setCurrentEncounteredIce(null));
    dispatch(clearUnencounteredIce());

    // Reset run state
    dispatch(setRunProgressState(RunProgressState.NOT_IN_RUN));

    // Transition to Main or End based on clicks
    const clicks = getState().turnState.turnRemainingClicks;
    if (clicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }
  };
};
