export type CardSize = "xs" | "sm";

export type SettingsState = {
  cardSize: CardSize;
  fullArt: boolean;
};

export enum SettingsActionTypes {
  SET_CARD_SIZE = "SET_CARD_SIZE",
  SET_FULL_ART = "SET_FULL_ART",
}

type SetCardSizeAction = {
  type: SettingsActionTypes.SET_CARD_SIZE;
  payload: CardSize;
};

type SetFullArtAction = {
  type: SettingsActionTypes.SET_FULL_ART;
  payload: boolean;
};

export type SettingsAction = SetCardSizeAction | SetFullArtAction;
