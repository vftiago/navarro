import { useEffect, useRef } from "react";
import { useGameState } from "./context/useGameState";
import { useThunk } from "./context/useThunk";
import {
  executeDrawPhase,
  executeCorpPhase,
  executeDiscardPhase,
  executeStartPlayerTurn,
  executeRunPhase,
  executeResolvePlayPhase,
  executeResolveRunPhase,
  executeResolveDrawPhase,
} from "./state/thunks";
import { TurnPhase } from "./state/reducers/turnReducer";

export const PhaseManager = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const { turnCurrentPhase } = gameState.turnState;

  const lastProcessedPhaseRef = useRef<TurnPhase | null>(null);

  useEffect(() => {
    if (turnCurrentPhase === lastProcessedPhaseRef.current) {
      return;
    }

    lastProcessedPhaseRef.current = turnCurrentPhase;

    switch (turnCurrentPhase) {
      case TurnPhase.Draw:
        dispatchThunk(executeDrawPhase());
        break;
      case TurnPhase.ResolveDraw:
        dispatchThunk(executeResolveDrawPhase());
        break;
      case TurnPhase.ResolvePlay:
        dispatchThunk(executeResolvePlayPhase());
        break;
      case TurnPhase.Run:
        dispatchThunk(executeRunPhase());
        break;
      case TurnPhase.ResolveRun:
        dispatchThunk(executeResolveRunPhase());
        break;
      case TurnPhase.Corp:
        dispatchThunk(executeCorpPhase());
        break;
      case TurnPhase.Discard:
        dispatchThunk(executeDiscardPhase());
        break;
      case TurnPhase.End:
        dispatchThunk(executeStartPlayerTurn());
        break;
      default:
        break;
    }
  }, [turnCurrentPhase, dispatchThunk]);

  return null;
};
