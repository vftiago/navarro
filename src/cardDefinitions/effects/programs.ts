/**
 * Program Effects - Effects specific to Program cards
 */
import { addPermanentEffect } from "../../state/board";
import { drawCards } from "../../state/player";
import { modifyClicks } from "../../state/turn";
import { EffectCost, TriggerMoment } from "../card";
import { ProgramEffectId } from "./registry";
import type { EffectImplementation } from "./types";

export const programEffects: Record<ProgramEffectId, EffectImplementation> = {
  [ProgramEffectId.DEEP_THOUGHTS_EXTRA_DRAW]: {
    getActions: ({ sourceId }) => {
      if (!sourceId) {
        throw new Error("Source ID is required for Deep Thoughts.");
      }

      const permanentEffect = {
        getModifier: () => 1,
        sourceId,
        targetSelector: "getPlayerCardsPerTurn",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: () => "Draw 1 extra card per turn.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [ProgramEffectId.INTRUSIVE_THOUGHTS_UPKEEP]: {
    getActions: () => [drawCards(1), modifyClicks(-1)],
    getText: () =>
      "At the beginning of your turn, draw 1 card and lose 1 click.",
    triggerMoment: TriggerMoment.ON_UPKEEP,
  },
  [ProgramEffectId.RUNNING_SNEAKERS_ON_RUN_END]: {
    getActions: () => [modifyClicks(1)],
    getText: () => "When you complete a run, gain 1 click.",
    triggerMoment: TriggerMoment.ON_RUN_END,
  },
  [ProgramEffectId.SLEDGEHAMMER_BREAK_BARRIER]: {
    costs: [EffectCost.CLICK],
    getActions: () => [],
    getText: () => "Break barrier subroutine.",
    triggerMoment: TriggerMoment.ON_CLICK,
  },
};
