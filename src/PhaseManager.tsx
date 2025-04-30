import { useEffect } from "react";
import { useGameState } from "./context/useGameState";
import { EXIT_ANIMATION_DURATION } from "./ui/constants";
import { useThunk } from "./context/useThunk";
import { DRAW_PHASE, GamePhase } from "./state/types";
import { executeDrawPhase } from "./state/thunks";

export const PhaseManager = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  useEffect(() => {
    switch (gameState.phaseState.currentPhase) {
      case GamePhase.Draw:
        dispatchThunk(executeDrawPhase());
        break;
      case "game/playPhase":
        dispatchThunk({ type: "game/playPhase" });
        break;
      case "game/accessPhase":
        dispatchThunk({ type: "game/accessPhase" });
        break;
      case "game/fetchPhase":
        dispatchThunk({ type: "game/fetchPhase" });
        break;
      case "game/discardPhase":
        dispatchThunk({ type: "game/discardPhase" });
        break;
      case "game/mainPhase":
        dispatchThunk({ type: "game/mainPhase" });
        break;
      case "game/resolvePhase":
        dispatchThunk({ type: "game/resolvePhase" });
        break;
      case "game/endPhase":
        dispatchThunk({ type: "game/endPhase" });
        break;
      case "game/corpPhase":
        dispatchThunk({ type: "game/corpPhase" });
        break;
      default:
        break;
    }
  }, [gameState.turn.currentPhase, dispatchThunk]);

    return () => clearTimeout(timer);
  }, [dispatch, turnNextAction]);

  return null;
};
