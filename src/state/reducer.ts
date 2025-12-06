import {
  type BoardAction,
  BoardActionTypes,
  boardReducer,
  initialBoardState,
} from "./board";
import {
  initialPendingState,
  type PendingActionType,
  PendingActionTypes,
  pendingReducer,
} from "./pending";
import {
  initialPlayerState,
  type PlayerAction,
  PlayerActionTypes,
  playerReducer,
} from "./player";
import {
  initialServerState,
  type ServerAction,
  ServerActionTypes,
  serverReducer,
} from "./server";
import {
  initialSettingsState,
  type SettingsAction,
  SettingsActionTypes,
  settingsReducer,
} from "./settings";
import {
  initialTurnState,
  type TurnAction,
  TurnActionTypes,
  turnReducer,
} from "./turn";
import type { GameAction, GameState } from "./types";

export const initialGameState: GameState = {
  boardState: initialBoardState,
  pendingState: initialPendingState,
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

const isPendingAction = (action: GameAction): action is PendingActionType => {
  return Object.values(PendingActionTypes).includes(
    action.type as PendingActionTypes,
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
    pendingState: isPendingAction(action)
      ? pendingReducer(state.pendingState, action)
      : state.pendingState,
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
