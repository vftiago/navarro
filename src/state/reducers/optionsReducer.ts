export type OptionsState = {
  cardSize: string;
};

export const initialOptionsState: OptionsState = {
  cardSize: "xs",
};

export enum OptionsActionTypes {
  SET_CARD_SIZE = "SET_CARD_SIZE",
}

export type OptionsAction = {
  type: OptionsActionTypes.SET_CARD_SIZE;
  payload: string;
};

export const setCardSize = (cardSize: string): OptionsAction => ({
  type: OptionsActionTypes.SET_CARD_SIZE,
  payload: cardSize,
});

export const optionsReducer = (
  state: OptionsState = initialOptionsState,
  action: OptionsAction,
): OptionsState => {
  switch (action.type) {
    case OptionsActionTypes.SET_CARD_SIZE:
      return {
        ...state,
        cardSize: action.payload,
      };

    default:
      return state;
  }
};
