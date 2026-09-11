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

/**
 * Ice renders as a landscape bar: as wide as a portrait card is tall, and
 * just tall enough for a name and a couple of subroutine lines.
 */
const ICE_CARD_SIZES = {
  sm: {
    h: "6rem",
    w: "24rem",
  },
  xs: {
    h: "4.75rem",
    w: "15rem",
  },
};

export const getIceCardSize = (
  state: GameState,
): {
  h: string;
  w: string;
} => ICE_CARD_SIZES[state.settingsState.cardSize];
