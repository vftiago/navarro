import { Tooltip } from "@mantine/core";
import clsx from "clsx";
import type { IconType } from "react-icons";
import {
  GiBrickWall,
  GiCircuitry,
  GiCyberEye,
  GiKeyCard,
} from "react-icons/gi";
import { getSubtypeReminderText } from "../../../cards/engine";
import { IceSubtype, ProgramSubtype } from "../../../cards/enums";

/**
 * One glyph per ice subtype, shared with the breaker that answers it: the
 * fracter wears the barrier's glyph, the decoder the code gate's, the killer
 * the sentry's. The player learns the matrix by matching shapes across the
 * wall and the rig rather than by reading subtype names; the tooltip spells
 * the match out ("Fracter. Breaks barriers.") since it is never card text.
 */
const GLYPHS: Partial<Record<IceSubtype | ProgramSubtype, IconType>> = {
  [IceSubtype.BARRIER]: GiBrickWall,
  [IceSubtype.CODE_GATE]: GiKeyCard,
  [IceSubtype.SENTRY]: GiCyberEye,
  [ProgramSubtype.AI]: GiCircuitry,
  [ProgramSubtype.DECODER]: GiKeyCard,
  [ProgramSubtype.FRACTER]: GiBrickWall,
  [ProgramSubtype.KILLER]: GiCyberEye,
};

export const SubtypeGlyph = ({
  className,
  subtype,
}: {
  className?: string;
  subtype: IceSubtype | ProgramSubtype;
}) => {
  const Icon = GLYPHS[subtype];
  if (!Icon) {
    return null;
  }

  const reminder = getSubtypeReminderText(subtype);

  return (
    <Tooltip label={reminder ? `${subtype}. ${reminder}` : subtype}>
      <span className={clsx("flex shrink-0", className)}>
        <Icon aria-label={subtype} className="size-3.5" />
      </span>
    </Tooltip>
  );
};
