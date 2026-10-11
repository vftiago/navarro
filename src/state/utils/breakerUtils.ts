import { canBreakIce } from "../../cards/engine";
import { CardType } from "../../cards/enums";
import type { CardInstance } from "../../cards/instance";
import { resolveCard } from "../../cards/instance";
import type { GameState } from "../types";
import { calculateIceStrength } from "./iceStrengthUtils";

/** Whether an installed program breaks an ice at its current (modified) strength */
export const canProgramBreakIce = (
  program: CardInstance,
  ice: CardInstance,
  state: GameState,
): boolean => {
  const programDefinition = resolveCard(program);
  const iceDefinition = resolveCard(ice);
  if (
    programDefinition.type !== CardType.PROGRAM ||
    iceDefinition.type !== CardType.ICE
  ) {
    return false;
  }

  return canBreakIce(
    programDefinition,
    iceDefinition,
    calculateIceStrength(ice, iceDefinition, state).current,
  );
};

/**
 * The installed programs that break the ice currently being encountered;
 * empty outside an encounter. Returns a fresh array — select through
 * `useShallow` from components.
 */
export const getEncounterBreakers = (state: GameState): CardInstance[] => {
  const ice = state.serverState.serverCurrentEncounteredIce;
  if (!ice) {
    return [];
  }

  return state.playerState.playerInstalledPrograms.filter((program) =>
    canProgramBreakIce(program, ice, state),
  );
};
