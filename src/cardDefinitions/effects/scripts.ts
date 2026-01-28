/**
 * Script Effects - Effects specific to Script cards
 */
import { initiateRun } from "../../state/phases/runPhase";
import { TriggerMoment } from "../card";
import { ScriptEffectId } from "./registry";
import type { EffectImplementation } from "./types";

export const scriptEffects: Record<ScriptEffectId, EffectImplementation> = {
  [ScriptEffectId.INITIATE_RUN]: {
    getText: () => "Initiate a run.",
    getThunk: () => initiateRun(),
    triggerMoment: TriggerMoment.ON_PLAY,
  },
};
