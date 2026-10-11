import type { ProgramCardDefinition } from "../../../cards/definitions";
import { getCardTextLines } from "../../../cards/engine";
import { getProgramChipSize } from "../../../state/settings";
import { useGameStore } from "../../../state/store";
import {
  BoardTile,
  RARITY_ACCENT,
  SubtypeGlyph,
  TileName,
  TileNumberColumn,
  TileTextLines,
} from "../BoardTile";
import { CardHoverEffect } from "../CardHoverEffect";

/**
 * An installed program is a chip on the rig: the same board tile shell as an
 * ice bar (art strip, name over text lines, number column) so the wall and
 * the rig read as one system, but narrower, dotted rather than hatched, and
 * in the player's cyan. Breakers show their strength in the column, on the
 * same edge as the ice's toll, so the core check (breaker strength against
 * ice strength) is reading down one column. Utilities have no column and the
 * body takes the full width.
 *
 * During an encounter a breaker that answers the faced ice lights up like
 * the ice itself: the two things the player can click share one glow.
 *
 * In hand the same card renders as a portrait card; this is the installed
 * form only.
 */
export const CardFrontProgram = ({
  definition,
  isBreakerForEncounter,
  onClick,
}: {
  definition: ProgramCardDefinition;
  isBreakerForEncounter?: boolean;
  onClick?: () => void;
}) => {
  const { art, h, w } = useGameStore(getProgramChipSize);
  const { flavorText, image, name, rarity, strength, subtype, type } =
    definition;

  return (
    <CardHoverEffect
      isHighlighted={isBreakerForEncounter}
      type={type}
      onClick={onClick}
    >
      <BoardTile
        accentClassName={RARITY_ACCENT[rarity]}
        art={{ alt: name, image }}
        artWidth={art}
        className="border-x-white/10 border-t-cyan-400/30 border-b-white/5 bg-neutral-900"
        column={
          strength === undefined ? undefined : (
            <TileNumberColumn
              label="str"
              texture="dots"
              tooltip="Breaker strength. Breaks ice of this strength or less."
            >
              <span className="font-orbitron text-2xl leading-none text-cyan-200">
                {strength}
              </span>
            </TileNumberColumn>
          )
        }
        h={h}
        w={w}
      >
        <TileName
          flavorText={flavorText}
          glyph={<SubtypeGlyph className="text-cyan-300" subtype={subtype} />}
          name={name}
        />
        <TileTextLines lines={getCardTextLines(definition)} />
      </BoardTile>
    </CardHoverEffect>
  );
};
