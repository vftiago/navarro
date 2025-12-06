import { CardType, TriggerMoment } from "../../cardDefinitions/card";
import { clearPendingAction, getPendingAction } from "../pending";
import {
  addToAccessedCards,
  addToDiscard,
  addToScoreArea,
  clearAccessedCards,
  getPlayerInstalledPrograms,
} from "../player";
import {
  addToUnencounteredIce,
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
import type { ThunkAction } from "../types";
import {
  executeCardEffects,
  executeCardTriggers,
  getCardEffectsByTrigger,
  getRandomServerCard,
} from "../utils";

/**
 * Run Phase - Orchestrator that encompasses Encounter/Access as internal states
 * A "run" is a complete flow: start run → encounter ice (0-N times) → access cards → select card → end run
 *
 * This phase uses runProgressState to track position within the run:
 * - NOT_IN_RUN: Initial entry, triggers ON_RUN_START, sets up ice
 * - ENCOUNTERING_ICE: Waiting for player to click ice, triggers ON_ENCOUNTER when clicked
 * - ACCESSING_CARDS: Waiting for player to select card, triggers ON_FETCH when selected
 *
 * ON_RUN_END fires when run completes (after access/fetch).
 */
export const runPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const progressState = state.turnState.runProgressState;

    switch (progressState) {
      case RunProgressState.NOT_IN_RUN: {
        // First entry into run phase - initialize the run
        const programs = getPlayerInstalledPrograms(state);

        // Trigger ON_RUN_START effects
        programs.forEach((card) => {
          const effects = getCardEffectsByTrigger(
            card,
            TriggerMoment.ON_RUN_START,
          );
          executeCardEffects(effects, dispatch, getState, {
            gameState: getState(),
            sourceId: card.deckContextId,
          });
        });

        // Initialize unencountered ice with all installed ice (innermost to outermost)
        const ice = state.serverState.serverInstalledIce;
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
        }
        break;
      }

      case RunProgressState.ENCOUNTERING_ICE: {
        // User clicked ice, pending action is set by event handler
        const pendingAction = getPendingAction(state);
        if (!pendingAction || pendingAction.type !== "CLICK_ICE") {
          console.error("runPhase: Expected CLICK_ICE pending action");
          return;
        }

        const currentIce = state.serverState.serverCurrentEncounteredIce;
        if (!currentIce || currentIce.deckContextId !== pendingAction.iceId) {
          console.error("runPhase: Ice mismatch in pending action");
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

        // Remove from unencountered list
        dispatch(removeFromUnencounteredIce(currentIce));
        dispatch(clearPendingAction());

        // Check for more ice
        const remainingIce = getServerUnencounteredIce(getState());
        if (remainingIce.length > 0) {
          // Set next ice as current, stay in ENCOUNTERING_ICE state
          dispatch(setCurrentEncounteredIce(remainingIce[0]));
          // State stays ENCOUNTERING_ICE - phaseCounter increments to re-render
        } else {
          // No more ice, transition to access
          dispatch(setCurrentEncounteredIce(null));

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
        }
        break;
      }

      case RunProgressState.ACCESSING_CARDS: {
        // User selected a card, pending action is set by event handler
        const accessPending = getPendingAction(state);
        if (!accessPending || accessPending.type !== "SELECT_ACCESSED_CARD") {
          console.error(
            "runPhase: Expected SELECT_ACCESSED_CARD pending action",
          );
          return;
        }

        const selectedCard = state.playerState.playerAccessedCards.find(
          (card) => card.deckContextId === accessPending.cardId,
        );

        if (!selectedCard) {
          console.error("runPhase: Selected card not found in accessed cards");
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

        // Clear accessed cards and pending action
        dispatch(clearAccessedCards());
        dispatch(clearPendingAction());

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
        break;
      }
    }
  };
};
