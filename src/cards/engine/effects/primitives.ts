import type { PermanentEffectT } from "../../../state/board";
import { addPermanentEffect } from "../../../state/board";
import { endRun } from "../../../state/phases";
import { initiateRun } from "../../../state/phases/runPhase";
import {
  drawCards,
  modifyPlayerSignal,
  modifyPlayerTags,
  modifyPlayerVictoryPoints,
} from "../../../state/player";
import {
  getServerSecurityLevel,
  modifyServerSecurity,
} from "../../../state/server";
import { modifyClicks } from "../../../state/turn";
import { dealNetDamage } from "../../../state/utils";
/**
 * Effect Primitives - Parameterized, reusable effect implementations
 *
 * Each primitive covers a whole family of card effects via params
 * (e.g. `draw` replaces DRAW_CARDS_1/DRAW_CARDS_3). Rules text is
 * generated from the same params, so text can never drift from behavior.
 */
import { TriggerMoment } from "../../enums";
import type { EffectImplementation, EffectParamsMap } from "./types";

export type PrimitiveEffectId =
  | "destroy_all_programs"
  | "draw"
  | "end_run"
  | "gain_victory_points"
  | "initiate_run"
  | "modify_cards_per_turn"
  | "modify_clicks"
  | "modify_other_ice_strength"
  | "modify_server_security"
  | "modify_signal"
  | "modify_tags"
  | "net_damage_per_security"
  | "strength_per_server_security";

const pluralize = (count: number, noun: string): string => {
  return Math.abs(count) === 1 ? noun : `${noun}s`;
};

const gainOrLose = (amount: number): string => {
  return amount >= 0 ? "Gain" : "Lose";
};

export const primitiveEffects: {
  [K in PrimitiveEffectId]: EffectImplementation<EffectParamsMap[K]>;
} = {
  destroy_all_programs: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    // TODO: implement program destruction (ported placeholder from Flush)
    getActions: () => [],
    getText: () => "Destroy all programs.",
  },
  draw: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }) => [drawCards(amount)],
    getText: ({ amount }) => `Draw ${amount} ${pluralize(amount, "card")}.`,
  },
  end_run: {
    defaultTrigger: TriggerMoment.ON_ENCOUNTER,
    getText: () => "End the run.",
    getThunk: () => endRun(),
  },
  gain_victory_points: {
    defaultTrigger: TriggerMoment.ON_FETCH,
    getActions: ({ amount }) => [modifyPlayerVictoryPoints(amount)],
    getText: ({ amount }) => `Score ${amount}.`,
  },
  initiate_run: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getText: () => "Initiate a run.",
    getThunk: () => initiateRun(),
  },
  modify_cards_per_turn: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }, { sourceId }) => {
      if (!sourceId) {
        throw new Error("Source ID required for modify_cards_per_turn.");
      }

      const permanentEffect: PermanentEffectT = {
        getModifier: () => amount,
        sourceId,
        targetSelector: "getPlayerCardsPerTurn",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: ({ amount }) =>
      `Draw ${amount} extra ${pluralize(amount, "card")} per turn.`,
  },
  modify_clicks: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }) => [modifyClicks(amount)],
    getText: ({ amount }) =>
      `${gainOrLose(amount)} ${Math.abs(amount)} ${pluralize(amount, "click")}.`,
  },
  modify_other_ice_strength: {
    defaultTrigger: TriggerMoment.ON_REZ,
    getActions: ({ amount }, { sourceId }) => {
      if (!sourceId) {
        throw new Error("Source ID required for modify_other_ice_strength.");
      }

      const permanentEffect: PermanentEffectT = {
        getModifier: ({ sourceId: src, targetId: tgt }) => {
          return src === tgt ? 0 : amount;
        },
        sourceId,
        targetSelector: "getIceStrength",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: ({ amount }) => `Other Ice gain ${amount} strength.`,
  },
  modify_server_security: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }) => [modifyServerSecurity(amount)],
    getText: ({ amount }) =>
      amount >= 0
        ? `Increase the server security level by ${amount}.`
        : `Reduce the server security level by ${Math.abs(amount)}.`,
  },
  modify_signal: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }) => [modifyPlayerSignal(amount)],
    getText: ({ amount }) =>
      `${gainOrLose(amount)} ${Math.abs(amount)} signal.`,
  },
  modify_tags: {
    defaultTrigger: TriggerMoment.ON_PLAY,
    getActions: ({ amount }) => [modifyPlayerTags(amount)],
    getText: ({ amount }) =>
      `${gainOrLose(amount)} ${Math.abs(amount)} ${pluralize(amount, "tag")}.`,
  },
  net_damage_per_security: {
    defaultTrigger: TriggerMoment.ON_ENCOUNTER,
    getText: () => "Take 1 net damage per server security level.",
    getThunk: (_params, { gameState }) => {
      return dealNetDamage(getServerSecurityLevel(gameState));
    },
  },
  strength_per_server_security: {
    // ON_REZ so the corp phase actually fires it when installing ice (the
    // old FIRE_WALL_DYNAMIC_STRENGTH was ON_PLAY, which never fires on ice)
    defaultTrigger: TriggerMoment.ON_REZ,
    getActions: (_params, { sourceId }) => {
      if (!sourceId) {
        throw new Error("Source ID required for strength_per_server_security.");
      }

      const permanentEffect: PermanentEffectT = {
        // Read the gameState passed at evaluation time, not the one captured
        // at rez time — strength must track the live security level
        getModifier: ({ gameState, sourceId: src, targetId: tgt }) => {
          return src === tgt ? gameState.serverState.serverSecurityLevel : 0;
        },
        sourceId,
        targetSelector: "getIceStrength",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: () => "Strength is equal to the server security level.",
  },
};
