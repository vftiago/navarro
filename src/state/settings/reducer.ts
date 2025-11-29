import { SettingsAction, SettingsActionTypes, SettingsState } from "./types";

export const initialSettingsState: SettingsState = {
  cardSize: "xs",
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

    default:
      return state;
  }
};
