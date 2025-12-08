import { delay } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useThunk } from "./state/hooks";
import {
  corpPhase,
  drawPhase,
  endPhase,
  mainPhase,
  upkeepPhase,
} from "./state/phases";
import { useGameStore } from "./state/store";
import { TurnPhase } from "./state/turn";

/**
 * PhaseManager handles automatic phase transitions only.
 * User-driven phases (Play, Run) are handled directly by the code that triggers them:
 * - Play: eventHandler calls playPhase() with payload
 * - Run: eventHandler or playPhase calls initiateRun() directly
 */
export const PhaseManager = () => {
  const { phaseCounter, turnCurrentPhase } = useGameStore(
    useShallow((state) => ({
      phaseCounter: state.turnState.phaseCounter,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  const dispatchThunk = useThunk();

  const lastPhaseCounterRef = useRef<number>(-1);

  type PhaseHandlers = {
    [P in TurnPhase]?: () => void | (() => void);
  };

  const PHASE_HANDLERS: PhaseHandlers = useMemo(() => {
    return {
      [TurnPhase.Corp]: () => {
        return delay(() => {
          dispatchThunk(corpPhase());
        }, 1000);
      },
      [TurnPhase.Draw]: () => dispatchThunk(drawPhase()),
      [TurnPhase.End]: () => dispatchThunk(endPhase()),
      [TurnPhase.Main]: () => dispatchThunk(mainPhase()),
      [TurnPhase.Upkeep]: () => dispatchThunk(upkeepPhase()),
      // Play and Run are user-driven, handled directly by eventHandler/playPhase
    };
  }, [dispatchThunk]);

  useEffect(() => {
    if (phaseCounter === lastPhaseCounterRef.current) {
      return;
    }

    lastPhaseCounterRef.current = phaseCounter;

    const action = PHASE_HANDLERS[turnCurrentPhase];

    if (action) {
      const cleanup = action();

      if (typeof cleanup === "function") {
        return cleanup;
      }
    }
  }, [PHASE_HANDLERS, phaseCounter, turnCurrentPhase]);

  return null;
};
