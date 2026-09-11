import { delay } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { executeTriggers } from "./cards/engine";
import { TriggerMoment } from "./cards/enums";
import { useThunk } from "./state/hooks";
import {
  corpPhase,
  drawPhase,
  endPhase,
  mainPhase,
  upkeepPhase,
} from "./state/phases";
import { ALL_SERVERS } from "./state/server";
import { getGameState, useGameStore } from "./state/store";
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

  /*
   * TEMPORARY (layout testing): ice seeded into the initial server state
   * (see server/reducer.ts) never went through the corp phase, so fire
   * ON_REZ for it once here or its strength modifiers are never registered.
   * Remove together with the seed.
   */
  const seededIceRezzedRef = useRef(false);
  useEffect(() => {
    if (seededIceRezzedRef.current) {
      return;
    }
    seededIceRezzedRef.current = true;

    const { dispatch, serverState } = useGameStore.getState();
    ALL_SERVERS.forEach((server) => {
      serverState.servers[server].installedIce.forEach((ice) => {
        executeTriggers(ice, TriggerMoment.ON_REZ, dispatch, getGameState);
      });
    });
  }, []);

  // A handler may return a cleanup function (e.g. Corp's delayed dispatch)
  type PhaseHandler = () => (() => void) | undefined;
  type PhaseHandlers = Partial<Record<TurnPhase, PhaseHandler>>;

  const PHASE_HANDLERS: PhaseHandlers = useMemo(() => {
    const run = (thunk: () => void): undefined => {
      thunk();

      return undefined;
    };

    return {
      [TurnPhase.Corp]: () => {
        return delay(() => {
          dispatchThunk(corpPhase());
        }, 1000);
      },
      [TurnPhase.Draw]: () => run(() => dispatchThunk(drawPhase())),
      [TurnPhase.End]: () => run(() => dispatchThunk(endPhase())),
      [TurnPhase.Main]: () => run(() => dispatchThunk(mainPhase())),
      [TurnPhase.Upkeep]: () => run(() => dispatchThunk(upkeepPhase())),
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
