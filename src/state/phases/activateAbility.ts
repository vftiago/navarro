import { executeEffectSpec, executeTriggers } from "../../cards/engine";
import { CardType, TriggerMoment } from "../../cards/enums";
import { resolveCard } from "../../cards/instance";
import { addToTrash, removeFromPrograms } from "../player";
import { batchDispatch } from "../store";
import {
  getTurnRemainingClicks,
  modifyClicks,
  setTurnCurrentPhase,
  TurnPhase,
} from "../turn";
import type { GameAction, ThunkAction } from "../types";

export type ActivateAbilityPayload = {
  programId: string;
};

/**
 * Activate an installed program's ability (Main phase, via the event
 * handler). Costs are paid in full, up front — click loss and self-trash
 * land before any effect resolves, so a trashed program is off the board
 * (and unclickable) by the time its own effects run. Effects then resolve
 * as much as possible, like any other effect.
 */
export const activateAbility = (
  payload: ActivateAbilityPayload,
): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();

    const program = state.playerState.playerInstalledPrograms.find(
      (installed) => installed.instanceId === payload.programId,
    );

    if (!program) {
      console.error("activateAbility: Program not installed");

      return;
    }

    const definition = resolveCard(program);

    if (definition.type !== CardType.PROGRAM) {
      console.error("activateAbility: Card is not a program");

      return;
    }

    const ability = definition.abilities?.[0];

    if (!ability) {
      console.error("activateAbility: Program has no activated ability");

      return;
    }

    const clickCost = ability.cost.clicks ?? 0;

    if (getTurnRemainingClicks(state) < clickCost) {
      console.warn("activateAbility: Not enough clicks to pay the cost");

      return;
    }

    // Pay all costs before anything resolves
    const costActions: GameAction[] = [];
    if (clickCost > 0) {
      costActions.push(modifyClicks(-clickCost));
    }
    if (ability.cost.trashSelf) {
      costActions.push(removeFromPrograms(program.instanceId));
    }
    batchDispatch(costActions);

    if (ability.cost.trashSelf) {
      // Trashing as a cost is intentional consumption — it fires ON_TRASH
      executeTriggers(program, TriggerMoment.ON_TRASH, dispatch, getState);
      dispatch(addToTrash(program));
    }

    ability.effects.forEach((spec) => {
      executeEffectSpec(spec, dispatch, getState, {
        gameState: getState(),
        sourceId: program.instanceId,
      });
    });

    // Out of clicks ends the turn (unless an effect already changed phase)
    if (
      getState().turnState.turnCurrentPhase === TurnPhase.Main &&
      getTurnRemainingClicks(getState()) <= 0
    ) {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }
  };
};
