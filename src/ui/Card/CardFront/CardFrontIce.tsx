import clsx from "clsx";
import { motion } from "framer-motion";
import { Fragment } from "react";
import type { IceCardDefinition } from "../../../cards/definitions";
import { getCardTextLines, resolveEffectSpecs } from "../../../cards/engine";
import type { CardInstance } from "../../../cards/instance";
import { resolveCard } from "../../../cards/instance";
import { ALL_SERVERS } from "../../../state/server";
import { getIceCardSize } from "../../../state/settings";
import { getGameState, useGameStore } from "../../../state/store";
import { calculateIceStrength } from "../../../state/utils/iceStrengthUtils";
import {
  BoardTile,
  getTextureStyle,
  RARITY_ACCENT,
  SubtypeGlyph,
  TileName,
  TileNumberColumn,
  TileTextLines,
} from "../BoardTile";
import { CardHoverEffect } from "../CardHoverEffect";

/** Shared face-down art, the same back every hidden card in the game shows */
const CARD_BACK_IMAGE = "_95bdd40b-cd24-4f75-9b35-75fb07f19cf3.jpg";

/**
 * Rez flip: the bar turns over around its long axis, face-down side first,
 * rezzed side landing. Both faces stay mounted so the flip is a pure
 * transform; the hidden face is culled by backface-visibility.
 */
const FLIP_DURATION = 0.7;
const FLIP_TRANSITION = {
  duration: FLIP_DURATION,
  ease: [0.32, 0.72, 0.28, 1] as const,
};

/**
 * Ice is a server card, not a player card: it is never in hand and never
 * played, it sits in the wall and taxes every dive. It renders as a
 * landscape board tile so the wall reads top to bottom as a stack of
 * barriers, and its total cost can be read at a glance from the strength
 * column. Diagonal hatching is the wall's signature texture.
 */
export const CardFrontIce = ({
  definition,
  instance,
  isBeingEncountered,
  onClick,
}: {
  definition: IceCardDefinition;
  instance: CardInstance;
  isBeingEncountered?: boolean;
  onClick?: () => void;
}) => {
  // Subscribe to board state to trigger re-renders when effects change
  useGameStore((state) => state.boardState);
  const securityLevel = useGameStore(
    (state) => state.serverState.serverSecurityLevel,
  );
  const { art, h, w } = useGameStore(getIceCardSize);

  const { flavorText, image, name, rarity, subtype, type } = definition;
  const isFaceDown = "isRezzed" in instance && instance.isRezzed === false;

  /*
   * Adaptive ice (strength tracks server security) shows its number in cyan
   * while it sits at the security level, and only turns green when something
   * else (e.g. Bad Moon) pushes it beyond that.
   */
  const isAdaptive = resolveEffectSpecs(definition).some(
    (spec) => spec.effect === "strength_per_server_security",
  );
  const textLines = getCardTextLines(definition);

  const gameState = getGameState();
  const {
    base: baseStrength,
    contributions,
    current: currentStrength,
  } = calculateIceStrength(instance, definition, gameState);

  // Name the source of each modifier for the strength breakdown tooltip
  const installedIce = ALL_SERVERS.flatMap(
    (server) => gameState.serverState.servers[server].installedIce,
  );
  const describeSource = (sourceId: string): string => {
    if (sourceId === instance.instanceId) {
      return isAdaptive ? "Security level" : name;
    }
    const source = installedIce.find((ice) => ice.instanceId === sourceId);

    return source ? resolveCard(source).name : "Unknown source";
  };
  const strengthBreakdown = (
    <div className="grid grid-cols-[auto_auto] gap-x-3 text-xs tabular-nums">
      <span>Base strength</span>
      <span className="text-right">{baseStrength}</span>
      {contributions.map(({ amount, sourceId }) => (
        <Fragment key={sourceId}>
          <span>{describeSource(sourceId)}</span>
          <span className="text-right">
            {amount > 0 ? `+${amount}` : amount}
          </span>
        </Fragment>
      ))}
      {contributions.length ? (
        <>
          <span className="border-t border-white/20 pt-0.5 font-bold">
            Strength
          </span>
          <span className="border-t border-white/20 pt-0.5 text-right font-bold">
            {currentStrength}
          </span>
        </>
      ) : null}
    </div>
  );
  const expectedStrength = isAdaptive
    ? baseStrength + securityLevel
    : baseStrength;
  const isModified = currentStrength !== expectedStrength;

  /*
   * Face-down: the player knows the wall got thicker, not with what. Same
   * silhouette as a rezzed bar so the wall keeps its shape, but every field
   * that would leak information (art, name, rarity, text, strength) is
   * redacted: the card back where the art strip goes, nothing where the
   * text goes, a question mark where the toll goes.
   */
  const faceDownBar = (
    <BoardTile
      art={{
        alt: "",
        className: "opacity-50 grayscale",
        image: CARD_BACK_IMAGE,
      }}
      artWidth={art}
      className="border-white/10 bg-neutral-950"
      column={
        <TileNumberColumn
          label="str"
          tooltip="Unrezzed ice. Its strength and subroutines are unknown until you encounter it."
        >
          <span className="font-orbitron text-2xl leading-none text-neutral-600">
            ?
          </span>
        </TileNumberColumn>
      }
      h={h}
      style={getTextureStyle("hatch")}
      w={w}
    />
  );

  const faceUpBar = (
    <BoardTile
      accentClassName={RARITY_ACCENT[rarity]}
      art={{ alt: name, image }}
      artWidth={art}
      className="border-x-white/10 border-t-white/20 border-b-white/5 bg-neutral-900"
      column={
        <TileNumberColumn
          label="str"
          texture="hatch"
          tooltip={strengthBreakdown}
        >
          <span
            className={clsx("font-orbitron text-2xl leading-none", {
              "text-cyan-300": isAdaptive && !isModified,
              "text-green-300": currentStrength > expectedStrength,
              "text-neutral-100": !isAdaptive && !isModified,
              "text-red-300": currentStrength < expectedStrength,
            })}
          >
            {currentStrength}
          </span>
        </TileNumberColumn>
      }
      h={h}
      w={w}
    >
      <TileName
        flavorText={flavorText}
        glyph={<SubtypeGlyph className="text-neutral-400" subtype={subtype} />}
        name={name}
      />
      <TileTextLines lines={textLines} />
    </BoardTile>
  );

  return (
    <CardHoverEffect
      isHighlighted={isBeingEncountered}
      type={type}
      onClick={onClick}
    >
      <div style={{ height: h, perspective: 900, width: w }}>
        <motion.div
          animate={{ rotateX: isFaceDown ? 0 : 180 }}
          className="relative h-full w-full"
          initial={false}
          style={{ transformStyle: "preserve-3d" }}
          transition={FLIP_TRANSITION}
        >
          <div
            aria-hidden={!isFaceDown}
            className={clsx("absolute inset-0 [backface-visibility:hidden]", {
              "pointer-events-none": !isFaceDown,
            })}
          >
            {faceDownBar}
          </div>
          <div
            aria-hidden={isFaceDown}
            className={clsx("absolute inset-0 [backface-visibility:hidden]", {
              "pointer-events-none": isFaceDown,
            })}
            style={{ transform: "rotateX(180deg)" }}
          >
            {faceUpBar}
            {/*
              Power-on flash as the rezzed face lands. initial={false} means
              ice that mounts already rezzed sits at the final keyframe and
              never flashes; only a live flip runs the sweep.
            */}
            <motion.div
              animate={{ opacity: isFaceDown ? 0 : [0, 0.85, 0] }}
              className="pointer-events-none absolute inset-0 rounded-md"
              initial={false}
              style={{
                background:
                  "linear-gradient(90deg, rgba(103,232,249,0.55), rgba(255,255,255,0.35) 40%, rgba(103,232,249,0.15))",
              }}
              transition={{
                delay: FLIP_DURATION * 0.45,
                duration: 0.55,
                ease: "easeOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </CardHoverEffect>
  );
};
