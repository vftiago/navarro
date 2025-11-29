import {
  BoardAction,
  BoardState,
} from "./board";
import {
  PlayerAction,
  PlayerState,
} from "./player";
import {
  ServerAction,
  ServerState,
} from "./server";
import {
  SettingsAction,
  SettingsState,
} from "./settings";
import {
  TurnAction,
  TurnState,
} from "./turn";

export type GameState = {
  settingsState: SettingsState;
  playerState: PlayerState;
  serverState: ServerState;
  turnState: TurnState;
  boardState: BoardState;
};

export type GameAction =
  | PlayerAction
  | ServerAction
  | TurnAction
  | BoardAction
  | SettingsAction;

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;
