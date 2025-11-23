import {
  BoardAction,
  BoardActionTypes,
  boardReducer,
  BoardState,
  initialBoardState,
} from "./reducers/boardReducer";
import {
  initialPlayerState,
  PlayerAction,
  PlayerActionTypes,
  playerReducer,
  PlayerState,
} from "./reducers/playerReducer";
import {
  initialServerState,
  ServerAction,
  ServerActionTypes,
  serverReducer,
  ServerState,
} from "./reducers/serverReducer";
import {
  initialSettingsState,
  SettingsAction,
  SettingsActionTypes,
  settingsReducer,
  SettingsState,
} from "./reducers/settingsReducer";
import {
  initialTurnState,
  TurnAction,
  TurnActionTypes,
  turnReducer,
  TurnState,
} from "./reducers/turnReducer";

// TODO: create folders per reducer domain, to group actions, reducer, selectors, and types
export type GameState = {
  settingsState: SettingsState;
  playerState: PlayerState;
  serverState: ServerState;
  turnState: TurnState;
  boardState: BoardState;
};

export const initialGameState: GameState = {
  boardState: initialBoardState,
  playerState: initialPlayerState,
  serverState: initialServerState,
  settingsState: initialSettingsState,
  turnState: initialTurnState,
};

export type GameAction =
  | PlayerAction
  | ServerAction
  | TurnAction
  | BoardAction
  | SettingsAction;

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
