import { Tooltip } from "@mantine/core";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { IoMdReturnRight } from "react-icons/io";
import type { CardTextLine } from "../../../cards/engine";
import { getTextureStyle, type TileTexture } from "./styles";

/**
 * Board tile: the shared shell for everything that sits on the table.
 *
 * Hand cards are the big, detailed things the player chooses from. Anything
 * installed is a compact token of state, read at a glance: art strip fading
 * into the body, name over a few text lines, and an optional number column
 * on the right edge. Ice bars and program chips are both this shell; they
 * differ in width, texture, accent and whether the column is present.
 */

export const TileLabel = ({ children }: { children: string }) => (
  <span className="font-orbitron text-[0.5rem] leading-none tracking-[0.25em] text-neutral-500 uppercase">
    {children}
  </span>
);

/** The number column on the tile's right edge: one big figure over a label */
export const TileNumberColumn = ({
  children,
  label,
  texture,
  tooltip,
}: {
  children: ReactNode;
  label: string;
  texture?: TileTexture;
  tooltip?: ReactNode;
}) => (
  <Tooltip disabled={!tooltip} label={tooltip}>
    <div
      className="flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 border-l border-white/10"
      style={texture ? getTextureStyle(texture) : undefined}
    >
      {children}
      <TileLabel>{label}</TileLabel>
    </div>
  </Tooltip>
);

/** Name line, with an optional leading glyph and the flavor text on hover */
export const TileName = ({
  flavorText,
  glyph,
  name,
}: {
  flavorText?: string;
  glyph?: ReactNode;
  name: string;
}) => (
  <div className="flex min-w-0 items-center gap-1.5">
    {glyph}
    <Tooltip
      multiline
      disabled={!flavorText}
      label={<span className="italic">{flavorText}</span>}
      w={220}
    >
      <span className="font-orbitron truncate text-xs leading-tight font-bold tracking-wide text-neutral-100">
        {name}
      </span>
    </Tooltip>
  </div>
);

/** Generated rules text, one line per effect; subroutines get the marker */
export const TileTextLines = ({ lines }: { lines: CardTextLine[] }) => (
  <div className="flex flex-col gap-1">
    {lines.map((line, index) => {
      const { isSubroutine, keyword, reminderText, text } = line;

      const body = keyword ? (
        <Tooltip label={reminderText}>
          <span className="text-purple-300">{text}</span>
        </Tooltip>
      ) : (
        <span>{text}</span>
      );

      return (
        <div
          className="flex items-start gap-1 text-xs leading-snug text-neutral-300"
          key={index}
        >
          {isSubroutine ? (
            <IoMdReturnRight className="mt-0.5 shrink-0 text-rose-400" />
          ) : null}
          {body}
        </div>
      );
    })}
  </div>
);

type BoardTileProps = {
  /** Rarity accent line along the top edge; omit for redacted tiles */
  accentClassName?: string;
  /**
   * Full art: the strip becomes the whole face, the body sinks to the
   * bottom edge over a scrim and the column keeps its backdrop. The caller
   * passes only the name as children — text lines have no room here.
   */
  fullArt?: boolean;
  art: {
    alt: string;
    /** Extra classes on the strip wrapper (e.g. dim a face-down tile) */
    className?: string;
    image: string;
  };
  /**
   * Absolute strip width. Fixed rather than a percentage so a narrower tile
   * keeps the same visible art mass as a wide one: the fade hides the
   * strip's right side, so what the eye gets is the left ~35%.
   */
  artWidth: string;
  children?: ReactNode;
  /** Border and background recipe for the tile face */
  className: string;
  column?: ReactNode;
  h: string;
  style?: CSSProperties;
  w: string;
};

export const BoardTile = ({
  accentClassName,
  art,
  artWidth,
  children,
  className,
  column,
  fullArt = false,
  h,
  style,
  w,
}: BoardTileProps) => (
  <div
    className={clsx(
      "relative flex overflow-hidden rounded-md border select-none hover:cursor-pointer",
      className,
    )}
    style={{ height: h, width: w, ...style }}
  >
    {accentClassName ? (
      <div
        className={clsx("absolute inset-x-0 top-0 z-10 h-0.5", accentClassName)}
      />
    ) : null}

    {/*
      The fade hides the strip's right side, so the visible mass sits around
      36% of the strip, not 50%. The image is drawn wider than the strip and
      anchored right, which shifts its center left to match. The mask stays
      on the wrapper so it does not move with the image.
    */}
    <div
      className={clsx(
        "overflow-hidden",
        fullArt
          ? "absolute inset-0"
          : "relative h-full shrink-0 [mask-image:linear-gradient(to_right,black_35%,transparent)]",
        art.className,
      )}
      style={fullArt ? undefined : { width: artWidth }}
    >
      <img
        alt={art.alt}
        className={clsx(
          "h-full max-w-none object-cover",
          fullArt ? "w-full" : "absolute inset-y-0 right-0 w-[115%]",
        )}
        loading="eager"
        src={`./assets/${art.image}`}
      />
      {fullArt ? (
        // Scrim so the name reads over any art
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-neutral-950/85 to-transparent" />
      ) : null}
    </div>

    <div
      className={clsx(
        "flex min-w-0 flex-1 flex-col gap-1 p-2",
        fullArt
          ? "relative z-10 justify-end text-shadow-md text-shadow-neutral-950"
          : "-ml-2",
      )}
    >
      {children}
    </div>

    {column && fullArt ? (
      <div className="relative z-10 flex bg-neutral-950/70 backdrop-blur-sm">
        {column}
      </div>
    ) : (
      column
    )}
  </div>
);
