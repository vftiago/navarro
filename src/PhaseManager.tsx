import { delay } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useGameState } from "./context/useGameState";
import { useThunk } from "./context/useThunk";
import { TurnPhase, TurnSubPhase } from "./state/reducers/turnReducer";
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

export const PhaseManager = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const { phaseChangeCounter, turnCurrentPhase, turnCurrentSubPhase } =
    gameState.turnState;

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
