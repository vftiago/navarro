export type SettingsState = {
  cardSize: "xs";
};

export const initialSettingsState: SettingsState = {
  cardSize: "xs",
};

export enum SettingsActionTypes {
  SET_CARD_SIZE = "SET_CARD_SIZE",
}

export type SettingsAction = {
  type: SettingsActionTypes.SET_CARD_SIZE;
  payload: "xs";
};

export const setCardSize = (cardSize: "xs"): SettingsAction => ({
  type: SettingsActionTypes.SET_CARD_SIZE,
  payload: cardSize,
});

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
