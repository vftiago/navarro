export type SettingsState = {
  cardSize: "xs";
  fullArt: boolean;
};

export enum SettingsActionTypes {
  SET_CARD_SIZE = "SET_CARD_SIZE",
  SET_FULL_ART = "SET_FULL_ART",
}

type SetCardSizeAction = {
  type: SettingsActionTypes.SET_CARD_SIZE;
  payload: "xs";
};

type SetFullArtAction = {
  type: SettingsActionTypes.SET_FULL_ART;
  payload: boolean;
};

export type SettingsAction = SetCardSizeAction | SetFullArtAction;
