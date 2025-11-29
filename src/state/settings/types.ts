export type SettingsState = {
  cardSize: "xs";
};

export enum SettingsActionTypes {
  SET_CARD_SIZE = "SET_CARD_SIZE",
}

export type SettingsAction = {
  type: SettingsActionTypes.SET_CARD_SIZE;
  payload: "xs";
};
