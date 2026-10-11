import type { GameState } from "../types";
import type { CardSize } from "./types";

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

/** Board tile sizes: a landscape footprint plus the art strip's fixed width */
type TileSize = { art: string; h: string; w: string };

/**
 * Ice renders as a landscape bar: as wide as two portrait cards, and just
 * tall enough for a name and a couple of subroutine lines.
 */
const ICE_CARD_SIZES: Record<CardSize, TileSize> = {
  sm: {
    art: "7.2rem",
    h: "6rem",
    w: "24rem",
  },
  xs: {
    art: "4.5rem",
    h: "4.75rem",
    w: "15rem",
  },
};

export const getIceCardSize = (state: GameState): TileSize =>
  ICE_CARD_SIZES[state.settingsState.cardSize];

/**
 * An installed program renders as a chip with the same footprint as an ice
 * bar, so the rig's sockets line up column for column under the servers and
 * the wall and the rig read as one grid. The art strip is a little tighter
 * than the bar's so the body keeps room for two lines of text next to the
 * strength column.
 */
const PROGRAM_CHIP_SIZES: Record<CardSize, TileSize> = {
  sm: {
    art: "6rem",
    h: ICE_CARD_SIZES.sm.h,
    w: ICE_CARD_SIZES.sm.w,
  },
  xs: {
    art: "3.75rem",
    h: ICE_CARD_SIZES.xs.h,
    w: ICE_CARD_SIZES.xs.w,
  },
};

export const getProgramChipSize = (state: GameState): TileSize =>
  PROGRAM_CHIP_SIZES[state.settingsState.cardSize];
