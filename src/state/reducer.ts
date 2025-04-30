import { GameState, GameAction } from "./types";
import { initialPlayerState, playerReducer } from "./reducers/playerReducer";
import { initialServerState, serverReducer } from "./reducers/serverReducer";
import { initialTurnState, turnReducer } from "./reducers/turnReducer";
import {
  initialTransitoryState,
  transitoryReducer,
} from "./reducers/transitoryReducer";
import { initialPhaseState, phaseReducer } from "./reducers/phaseReducer";

export const initialGameState: GameState = {
  playerState: initialPlayerState,
  serverState: initialServerState,
  turnState: initialTurnState,
  phaseState: initialPhaseState,
  transitoryState: initialTransitoryState,
};

export const rootReducer = (
  state: GameState = initialGameState,
  action: GameAction,
): GameState => {
  return {
    playerState: playerReducer(state.playerState, action),
    serverState: serverReducer(state.serverState, action),
    turnState: turnReducer(state.turnState, action),
    phaseState: phaseReducer(state.phaseState, action),
    transitoryState: transitoryReducer(state.transitoryState, action),
  };
};
