/**
 * Ice Effects - Effects specific to Ice cards
 */
import type { PermanentEffectT } from "../../state/board";
import { addPermanentEffect } from "../../state/board";
import { endRun } from "../../state/phases";
import { getServerSecurityLevel } from "../../state/server";
import { dealNetDamage } from "../../state/utils";
import { TriggerMoment } from "../card";
import { IceEffectId } from "./registry";
import type { EffectImplementation } from "./types";

export const iceEffects: Record<IceEffectId, EffectImplementation> = {
  [IceEffectId.BAD_MOON_BUFF_OTHER_ICE]: {
    getActions: ({ sourceId }) => {
      if (!sourceId) {
        throw new Error("Source ID required for Bad Moon effect.");
      }

      const permanentEffect: PermanentEffectT = {
        getModifier: ({ sourceId: src, targetId: tgt }) => {
          return src === tgt ? 0 : 1;
        },
        sourceId,
        targetSelector: "getIceStrength",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: () => "Other Ice gain 1 strength.",
    triggerMoment: TriggerMoment.ON_REZ,
  },
  [IceEffectId.END_RUN]: {
    getText: () => "End the run.",
    getThunk: () => endRun(),
    triggerMoment: TriggerMoment.ON_ENCOUNTER,
  },
  [IceEffectId.FIRE_WALL_DYNAMIC_STRENGTH]: {
    getActions: ({ gameState, sourceId, targetId }) => {
      if (!sourceId || !targetId) {
        throw new Error("Source and Target IDs required for Fire Wall effect.");
      }

      const permanentEffect: PermanentEffectT = {
        getModifier: ({ sourceId: src, targetId: tgt }) => {
          return src === tgt ? gameState.serverState.serverSecurityLevel : 0;
        },
        sourceId,
        targetSelector: "getIceStrength",
      };

      return [addPermanentEffect(permanentEffect)];
    },
    getText: () =>
      "Fire Wall's strength is equal to the server security level.",
    triggerMoment: TriggerMoment.ON_PLAY,
  },
  [IceEffectId.FIRE_WALL_NET_DAMAGE]: {
    getText: () => "Take 1 net damage per server security level.",
    getThunk: ({ gameState }) => {
      const serverSecurityLevel = getServerSecurityLevel(gameState);
      return dealNetDamage(serverSecurityLevel);
    },
    triggerMoment: TriggerMoment.ON_ENCOUNTER,
  },
};
