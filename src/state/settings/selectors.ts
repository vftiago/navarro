import type { GameState } from "../types";

const CARD_SIZES = {
  sm: {
    h: "18rem",
    w: "12rem",
  },
  xs: {
    h: "15rem",
    w: "10rem",
  },
};

export const getCardSize = (
  state: GameState,
): {
  h: string;
  w: string;
} => CARD_SIZES[state.settingsState.cardSize];

export const getFullArt = (state: GameState): boolean =>
  state.settingsState.fullArt;
