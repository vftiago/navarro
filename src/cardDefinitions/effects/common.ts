/**
 * Common Effects - Simple resource modification effects
 *
 * These effects are reusable across multiple cards.
 */
import {
  drawCards,
  modifyPlayerSignal,
  modifyPlayerTags,
  modifyPlayerVictoryPoints,
} from "../../state/player";
import { modifyServerSecurity } from "../../state/server";
import { modifyClicks } from "../../state/turn";
import { TriggerMoment } from "../card";
import { CommonEffectId } from "./registry";
import type { EffectImplementation } from "./types";

export const commonEffects: Record<CommonEffectId, EffectImplementation> = {
  [CommonEffectId.DRAW_CARDS_1]: {
    getActions: () => [drawCards(1)],
    getText: () => "Draw 1 card.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.DRAW_CARDS_3]: {
    getActions: () => [drawCards(3)],
    getText: () => "Draw 3 cards.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.GAIN_CLICKS_1]: {
    getActions: () => [modifyClicks(1)],
    getText: () => "Gain 1 click.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.GAIN_CLICKS_3]: {
    getActions: () => [modifyClicks(3)],
    getText: () => "Gain 3 ticks.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.GAIN_SIGNAL_5]: {
    getActions: () => [modifyPlayerSignal(5)],
    getText: () => "Gain 5 signal.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.GAIN_TAG_1]: {
    getActions: () => [modifyPlayerTags(1)],
    getText: () => "Gain 1 tag.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.GAIN_VICTORY_POINTS_2]: {
    getActions: () => [modifyPlayerVictoryPoints(2)],
    getText: () => "Score 2.",
    triggerMoment: TriggerMoment.ON_FETCH,
  },
  [CommonEffectId.GAIN_VICTORY_POINTS_3]: {
    getActions: () => [modifyPlayerVictoryPoints(3)],
    getText: () => "Score 3.",
    triggerMoment: TriggerMoment.ON_FETCH,
  },
  [CommonEffectId.LOSE_CLICKS_1]: {
    getActions: () => [modifyClicks(-1)],
    getText: () => "Lose 1 click.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [CommonEffectId.REDUCE_SERVER_SECURITY_1]: {
    getActions: () => [modifyServerSecurity(-1)],
    getText: () => "Reduce server security level by 1.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
};
