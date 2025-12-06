import type { ThunkAction } from "../types";

/**
 * Main Phase - Consolidated single handler (no subphases)
 * This is the player's action window - a pure waiting state.
 * The phase persists until the player:
 * - Plays a card (→ Play phase)
 * - Initiates a run (→ Run phase)
 * - Manually ends turn (→ End phase)
 *
 * Note: This phase does NOT trigger any effects.
 * ON_UPKEEP effects are triggered in the Upkeep phase (which runs before Main).
 */
export const mainPhase = (): ThunkAction => {
  return () => {
    // Main phase is a pure waiting state - no effects, no phase transition
    // Player actions (via event system) will transition to other phases
  };
};
