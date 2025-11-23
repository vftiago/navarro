import { delay } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useThunk } from "./context/useThunk";
import { TurnPhase, TurnSubPhase } from "./state/reducers/turnReducer";
import {
  endCorpPhase,
  endDrawPhase,
  endEndPhase,
  endPlayPhase,
  endRunPhase,
  processCorpPhase,
  processDrawPhase,
  processEndPhase,
  processPlayPhase,
  processRunPhase,
  startCorpPhase,
  startDrawPhase,
  startEndPhase,
  startRunPhase,
} from "./state/thunks";
import { useGameStore } from "./store/gameStore";

export const PhaseManager = () => {
  const { phaseChangeCounter, turnCurrentPhase, turnCurrentSubPhase } =
    useGameStore(
      useShallow((state) => ({
        phaseChangeCounter: state.turnState.phaseChangeCounter,
        turnCurrentPhase: state.turnState.turnCurrentPhase,
        turnCurrentSubPhase: state.turnState.turnCurrentSubPhase,
      })),
    );

  const dispatchThunk = useThunk();

  const lastCounterRef = useRef<number>(-1);

  type PhaseHandlers = {
    [P in TurnPhase]?: {
      [S in TurnSubPhase]?: () => void | (() => void);
    };
  };

  const PHASE_HANDLERS: PhaseHandlers = useMemo(() => {
    return {
      [TurnPhase.Corp]: {
        [TurnSubPhase.End]: () => dispatchThunk(endCorpPhase()),
        [TurnSubPhase.Process]: () => {
          return delay(() => {
            dispatchThunk(processCorpPhase());
          }, 1000);
        },
        [TurnSubPhase.Start]: () => dispatchThunk(startCorpPhase()),
      },
      [TurnPhase.Draw]: {
        [TurnSubPhase.End]: () => dispatchThunk(endDrawPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processDrawPhase()),
        [TurnSubPhase.Start]: () => dispatchThunk(startDrawPhase()),
      },
      [TurnPhase.End]: {
        [TurnSubPhase.End]: () => dispatchThunk(endEndPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processEndPhase()),
        [TurnSubPhase.Start]: () => dispatchThunk(startEndPhase()),
      },
      [TurnPhase.Play]: {
        [TurnSubPhase.End]: () => dispatchThunk(endPlayPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processPlayPhase()),
      },
      [TurnPhase.Run]: {
        [TurnSubPhase.End]: () => dispatchThunk(endRunPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processRunPhase()),
        [TurnSubPhase.Start]: () => dispatchThunk(startRunPhase()),
      },
    };
  }, [dispatchThunk]);

  useEffect(() => {
    if (phaseChangeCounter === lastCounterRef.current) {
      return;
    }

    lastCounterRef.current = phaseChangeCounter;

    const action = PHASE_HANDLERS[turnCurrentPhase]?.[turnCurrentSubPhase];

    if (action) {
      const cleanup = action();

      if (typeof cleanup === "function") {
        return cleanup;
      }
    }
  }, [
    PHASE_HANDLERS,
    phaseChangeCounter,
    turnCurrentPhase,
    turnCurrentSubPhase,
  ]);

  return null;
};
