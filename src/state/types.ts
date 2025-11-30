import { type BoardAction, type BoardState } from "./board";
import { type PlayerAction, type PlayerState } from "./player";
import { type ServerAction, type ServerState } from "./server";
import { type SettingsAction, type SettingsState } from "./settings";
import { type TurnAction, type TurnState } from "./turn";

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
