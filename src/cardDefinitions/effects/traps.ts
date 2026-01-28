/**
 * Trap Effects - Effects specific to Trap/Server cards
 */
import { setTurnCurrentPhase, TurnPhase } from "../../state/turn";
import { TriggerMoment } from "../card";
import { TrapEffectId } from "./registry";
import type { EffectImplementation } from "./types";

export const trapEffects: Record<TrapEffectId, EffectImplementation> = {
  [TrapEffectId.SERVER_LOCKDOWN_CONDITIONAL_END]: {
    getActions: ({ gameState }) => {
      const serverSecurityLevel = gameState.serverState.serverSecurityLevel;
      return serverSecurityLevel >= 3
        ? [setTurnCurrentPhase(TurnPhase.End)]
        : [];
    },
    getText: () =>
      "On Access, if the server security level is 3 or more, end the run.",
    triggerMoment: TriggerMoment.ON_ACCESS,
  },
};
