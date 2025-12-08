import { type BoardAction, type BoardState } from "./board";
import { type PlayerAction, type PlayerState } from "./player";
import { type ServerAction, type ServerState } from "./server";
import { type SettingsAction, type SettingsState } from "./settings";
import { type TurnAction, type TurnState } from "./turn";

export type GameState = {
  boardState: BoardState;
  playerState: PlayerState;
  serverState: ServerState;
  settingsState: SettingsState;
  turnState: TurnState;
};

export type GameAction =
  | BoardAction
  | PlayerAction
  | ServerAction
  | SettingsAction
  | TurnAction;

export type ThunkAction = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
) => void;
