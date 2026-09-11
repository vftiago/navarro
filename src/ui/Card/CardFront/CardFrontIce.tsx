import { Tooltip } from "@mantine/core";
import clsx from "clsx";
import { Fragment } from "react";
import { IoMdReturnRight } from "react-icons/io";
import type { IceCardDefinition } from "../../../cards/definitions";
import { getCardTextLines, resolveEffectSpecs } from "../../../cards/engine";
import { CardRarity } from "../../../cards/enums";
import type { CardInstance } from "../../../cards/instance";
import { resolveCard } from "../../../cards/instance";
import { ALL_SERVERS } from "../../../state/server";
import { getIceCardSize } from "../../../state/settings";
import { getGameState, useGameStore } from "../../../state/store";
import { calculateIceStrength } from "../../../state/utils/iceStrengthUtils";
import { CardHoverEffect } from "../CardHoverEffect";

const RARITY_ACCENT: Record<CardRarity, string> = {
  [CardRarity.BASIC]: "bg-neutral-600",
  [CardRarity.COMMON]: "bg-neutral-400",
  [CardRarity.RARE]: "bg-indigo-400",
  [CardRarity.UNCOMMON]: "bg-cyan-400",
};

/** Diagonal hatching, the visual signature of the wall */
const HATCH =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 9px)";

const Label = ({ children }: { children: string }) => (
  <span className="font-orbitron text-[0.5rem] leading-none tracking-[0.25em] text-neutral-500 uppercase">
    {children}
  </span>
);

/**
 * Ice is a server card, not a player card: it is never in hand and never
 * played, it sits in the wall and taxes every dive. It renders as a
 * landscape bar so the wall reads top to bottom as a stack of barriers,
 * and its total cost can be read at a glance from the strength column.
 *
 * Layout, left to right: art strip (fades into the body), name over the
 * subroutine lines, strength column with the toll number.
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
  const { h, w } = useGameStore(getIceCardSize);

  const { flavorText, image, name, rarity, type } = definition;
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

  if (isFaceDown) {
    // The player knows the wall got thicker, not with what.
    return (
      <CardHoverEffect type={type} onClick={onClick}>
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-md border border-dashed border-white/15 bg-neutral-950 select-none hover:cursor-pointer"
          style={{ backgroundImage: HATCH, height: h, width: w }}
        >
          <span className="font-orbitron text-lg tracking-[0.5em] text-neutral-700">
            ICE
          </span>
        </div>
      </CardHoverEffect>
    );
  }

  return (
    <CardHoverEffect
      isBeingEncountered={isBeingEncountered}
      type={type}
      onClick={onClick}
    >
      <div
        className="relative flex overflow-hidden rounded-md border border-x-white/10 border-t-white/20 border-b-white/5 bg-neutral-900 select-none hover:cursor-pointer"
        style={{ height: h, width: w }}
      >
        <div
          className={clsx(
            "absolute inset-x-0 top-0 z-10 h-0.5",
            RARITY_ACCENT[rarity],
          )}
        />

        {/*
          The fade hides the strip's right side, so the visible mass sits
          around 36% of the strip, not 50%. The image is drawn wider than the
          strip and anchored right, which shifts its center left to match.
          The mask stays on the wrapper so it does not move with the image.
        */}
        <div className="relative h-full w-[30%] shrink-0 overflow-hidden [mask-image:linear-gradient(to_right,black_35%,transparent)]">
          <img
            alt={name}
            className="absolute inset-y-0 right-0 h-full w-[115%] max-w-none object-cover"
            loading="eager"
            src={`./assets/${image}`}
          />
        </div>

        <div className="-ml-2 flex min-w-0 flex-1 flex-col gap-1 p-2">
          <div className="flex min-w-0 items-baseline gap-1.5">
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

          <div className="flex flex-col gap-1">
            {textLines.map((line, index) => {
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
        </div>

        <Tooltip label={strengthBreakdown}>
          <div
            className="flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 border-l border-white/10"
            style={{ backgroundImage: HATCH }}
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
            <Label>str</Label>
          </div>
        </Tooltip>
      </div>
    </CardHoverEffect>
  );
};
