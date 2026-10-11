import type { CSSProperties } from "react";
import { CardRarity } from "../../../cards/enums";

export const RARITY_ACCENT: Record<CardRarity, string> = {
  [CardRarity.BASIC]: "bg-neutral-600",
  [CardRarity.COMMON]: "bg-neutral-400",
  [CardRarity.RARE]: "bg-indigo-400",
  [CardRarity.UNCOMMON]: "bg-cyan-400",
};

/** Surface textures: each owner has a signature. Ice is hatched, the rig is dotted. */
export type TileTexture = "dots" | "hatch";

const TEXTURE_STYLE: Record<TileTexture, CSSProperties> = {
  dots: {
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "6px 6px",
  },
  hatch: {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 9px)",
  },
};

export const getTextureStyle = (texture: TileTexture): CSSProperties =>
  TEXTURE_STYLE[texture];
