import { SettingsAction, SettingsActionTypes } from "./types";

export const setCardSize = (cardSize: "xs"): SettingsAction => ({
  payload: cardSize,
  type: SettingsActionTypes.SET_CARD_SIZE,
});
