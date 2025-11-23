import { useEffect, useMemo, useRef } from "react";
import { useGameState } from "./context/useGameState";
import { useThunk } from "./context/useThunk";
import {
  endPlayPhase,
  endDrawPhase,
  startDrawPhase,
  processDrawPhase,
  processPlayPhase,
  startRunPhase,
  processRunPhase,
  endRunPhase,
  startEndPhase,
  processEndPhase,
  endEndPhase,
  startCorpPhase,
  processCorpPhase,
  endCorpPhase,
} from "./state/thunks";
import { TurnPhase, TurnSubPhase } from "./state/reducers/turnReducer";
import { delay } from "framer-motion";

export const PhaseManager = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const { turnCurrentPhase, turnCurrentSubPhase, phaseChangeCounter } =
    gameState.turnState;

  const lastCounterRef = useRef<number>(-1);

  type PhaseHandlers = {
    [P in TurnPhase]?: {
      [S in TurnSubPhase]?: () => void | (() => void);
    };
  };

  const PHASE_HANDLERS: PhaseHandlers = useMemo(() => {
    return {
      [TurnPhase.Draw]: {
        [TurnSubPhase.Start]: () => dispatchThunk(startDrawPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processDrawPhase()),
        [TurnSubPhase.End]: () => dispatchThunk(endDrawPhase()),
      },
      [TurnPhase.Play]: {
        [TurnSubPhase.Process]: () => dispatchThunk(processPlayPhase()),
        [TurnSubPhase.End]: () => dispatchThunk(endPlayPhase()),
      },
      [TurnPhase.Run]: {
        [TurnSubPhase.Start]: () => dispatchThunk(startRunPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processRunPhase()),
        [TurnSubPhase.End]: () => dispatchThunk(endRunPhase()),
      },
      [TurnPhase.End]: {
        [TurnSubPhase.Start]: () => dispatchThunk(startEndPhase()),
        [TurnSubPhase.Process]: () => dispatchThunk(processEndPhase()),
        [TurnSubPhase.End]: () => dispatchThunk(endEndPhase()),
      },
      [TurnPhase.Corp]: {
        [TurnSubPhase.Start]: () => dispatchThunk(startCorpPhase()),
        [TurnSubPhase.Process]: () => {
          return delay(() => {
            dispatchThunk(processCorpPhase());
          }, 1000);
        },
        [TurnSubPhase.End]: () => dispatchThunk(endCorpPhase()),
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
