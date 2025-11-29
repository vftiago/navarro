import {
  BoardAction,
  BoardActionTypes,
  boardReducer,
  initialBoardState,
} from "./board";
import {
  initialPlayerState,
  PlayerAction,
  PlayerActionTypes,
  playerReducer,
} from "./player";
import {
  initialServerState,
  ServerAction,
  ServerActionTypes,
  serverReducer,
} from "./server";
import {
  initialSettingsState,
  SettingsAction,
  SettingsActionTypes,
  settingsReducer,
} from "./settings";
import {
  initialTurnState,
  TurnAction,
  TurnActionTypes,
  turnReducer,
} from "./turn";
import {
  GameAction,
  GameState,
} from "./types";

export type { GameAction, GameState } from "./types";

export const initialGameState: GameState = {
  boardState: initialBoardState,
  playerState: initialPlayerState,
  serverState: initialServerState,
  settingsState: initialSettingsState,
  turnState: initialTurnState,
};

const isSettingsAction = (action: GameAction): action is SettingsAction => {
  return Object.values(SettingsActionTypes).includes(
    action.type as SettingsActionTypes,
  );
};

const isPlayerAction = (action: GameAction): action is PlayerAction => {
  return Object.values(PlayerActionTypes).includes(
    action.type as PlayerActionTypes,
  );
};

const isServerAction = (action: GameAction): action is ServerAction => {
  return Object.values(ServerActionTypes).includes(
    action.type as ServerActionTypes,
  );
};

const isTurnAction = (action: GameAction): action is TurnAction => {
  return Object.values(TurnActionTypes).includes(
    action.type as TurnActionTypes,
  );
};

const isBoardAction = (action: GameAction): action is BoardAction => {
  return Object.values(BoardActionTypes).includes(
    action.type as BoardActionTypes,
  );
};

export const rootReducer = (
  state: GameState = initialGameState,
  action: GameAction,
): GameState => {
  return {
    boardState: isBoardAction(action)
      ? boardReducer(state.boardState, action)
      : state.boardState,
    playerState: isPlayerAction(action)
      ? playerReducer(state.playerState, action)
      : state.playerState,
    serverState: isServerAction(action)
      ? serverReducer(state.serverState, action)
      : state.serverState,
    settingsState: isSettingsAction(action)
      ? settingsReducer(state.settingsState, action)
      : state.settingsState,
    turnState: isTurnAction(action)
      ? turnReducer(state.turnState, action)
      : state.turnState,
  };
};
