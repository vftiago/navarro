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

  const { turnCurrentPhase, turnCurrentSubPhase } = gameState.turnState;

  const lastProcessedPhaseRef = useRef<string>(null);

  type PhaseHandlers = {
    [P in TurnPhase]?: {
      [S in TurnSubPhase]?: () => void;
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
          void delay(() => {
            dispatchThunk(processCorpPhase());
          }, 1000);
        },
        [TurnSubPhase.End]: () => dispatchThunk(endCorpPhase()),
      },
    };
  }, [dispatchThunk]);

  useEffect(() => {
    const currentPhase = JSON.stringify({
      turnCurrentPhase,
      turnCurrentSubPhase,
    });

    if (currentPhase === lastProcessedPhaseRef.current) {
      return;
    }

    lastProcessedPhaseRef.current = currentPhase;

    const action = PHASE_HANDLERS[turnCurrentPhase]?.[turnCurrentSubPhase];

    if (action) {
      action();
    }
  }, [PHASE_HANDLERS, turnCurrentPhase, turnCurrentSubPhase]);

  return null;
};
