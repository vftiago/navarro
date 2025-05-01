import {
  BoardAction,
  BoardActionTypes,
  boardReducer,
  BoardState,
  initialBoardState,
} from "./reducers/boardReducer";
import {
  initialOptionsState,
  OptionsAction,
  OptionsActionTypes,
  optionsReducer,
  OptionsState,
} from "./reducers/optionsReducer";
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
  initialTurnState,
  TurnAction,
  TurnActionTypes,
  turnReducer,
  TurnState,
} from "./reducers/turnReducer";

// TODO: create folders per reducer domain, to group actions, reducer, selectors, and types
export type GameState = {
  optionsState: OptionsState;
  playerState: PlayerState;
  serverState: ServerState;
  turnState: TurnState;
  boardState: BoardState;
};

export const initialGameState: GameState = {
  optionsState: initialOptionsState,
  playerState: initialPlayerState,
  serverState: initialServerState,
  turnState: initialTurnState,
  boardState: initialBoardState,
};

export type GameAction =
  | PlayerAction
  | ServerAction
  | TurnAction
  | BoardAction
  | OptionsAction;

const isOptionsAction = (action: GameAction): action is OptionsAction => {
  return Object.values(OptionsActionTypes).includes(
    action.type as OptionsActionTypes,
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
    optionsState: isOptionsAction(action)
      ? optionsReducer(state.optionsState, action)
      : state.optionsState,
    playerState: isPlayerAction(action)
      ? playerReducer(state.playerState, action)
      : state.playerState,
    serverState: isServerAction(action)
      ? serverReducer(state.serverState, action)
      : state.serverState,
    turnState: isTurnAction(action)
      ? turnReducer(state.turnState, action)
      : state.turnState,
    boardState: isBoardAction(action)
      ? boardReducer(state.boardState, action)
      : state.boardState,
  };
};
