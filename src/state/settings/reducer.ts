import type { SettingsAction, SettingsState } from "./types";
import { SettingsActionTypes } from "./types";

export const initialSettingsState: SettingsState = {
  cardSize: "xs",
  fullArt: false,
};

export const settingsReducer = (
  state: SettingsState = initialSettingsState,
  action: SettingsAction,
): SettingsState => {
  switch (action.type) {
    case SettingsActionTypes.SET_CARD_SIZE:
      return {
        ...state,
        cardSize: action.payload,
      };

    case SettingsActionTypes.SET_FULL_ART:
      return {
        ...state,
        fullArt: action.payload,
      };

    default:
      return state;
  }
};
