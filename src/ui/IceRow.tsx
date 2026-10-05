import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import type { ServerName } from "../state/server";
import { getIceCardSize } from "../state/settings";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";

/*
 * Install: the corp drops the new bar onto its socket from just above,
 * slightly oversized, and it settles with a spring. The short delay lets
 * the Corp Turn overlay clear first so the drop happens in full view.
 * Pulled (a patch): the old bar slides out sideways and fades while the
 * rest of the wall closes ranks via layout animation.
 */
const ICE_SLOT_VARIANTS = {
  installed: {
    opacity: 1,
    scale: 1,
    transition: {
      damping: 26,
      delay: 0.25,
      opacity: { delay: 0.25, duration: 0.2 },
      stiffness: 520,
      type: "spring" as const,
    },
    y: 0,
  },
  installing: { opacity: 0, scale: 1.06, y: -18 },
  pulled: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" as const },
    x: 48,
  },
};

/** Faint white flash as the bar lands; inherits the parent's variant */
const LANDING_FLASH_VARIANTS = {
  installed: {
    opacity: [0, 0.5, 0],
    transition: { delay: 0.45, duration: 0.5, ease: "easeOut" as const },
  },
  installing: { opacity: 0 },
  pulled: { opacity: 0 },
};

/** One server and the wall of ice in front of it */
export const IceRow = ({ server }: { server: ServerName }) => {
  const {
    isSelected,
    runProgressState,
    serverCurrentEncounteredIce,
    serverIce,
    serverMaxIceSlots,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      isSelected: state.serverState.selectedServer === server,
      runProgressState: state.turnState.runProgressState,
      serverCurrentEncounteredIce:
        state.serverState.serverCurrentEncounteredIce,
      serverIce: state.serverState.servers[server].installedIce,
      serverMaxIceSlots: state.serverState.serverMaxIceSlots,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  const eventBus = useEventBus();
  const iceSize = useGameStore(getIceCardSize);

  const isEncounterActive =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ENCOUNTERING_ICE;

  const handleIceClick = (iceId: string) => {
    // UX gating only — the event handler is the authority on click rules
    if (
      isEncounterActive &&
      serverCurrentEncounteredIce?.instanceId === iceId
    ) {
      eventBus.emit({
        payload: { instanceId: iceId },
        type: GameEventType.CARD_CLICKED,
      });
    }
  };

  const handleServerClick = () => {
    // UX gating only — the event handler is the authority
    if (turnCurrentPhase === TurnPhase.Main && !isSelected) {
      eventBus.emit({
        payload: { server },
        type: GameEventType.PLAYER_SELECT_SERVER,
      });
    }
  };

  const slotStyle = { height: iceSize.h, width: iceSize.w };

  /*
   * The wall is a column: the server on top, then ice from innermost
   * (index 0) down to outermost. The run encounters the outermost
   * ice first, so the ice nearest the player is the one they hit next.
   *
   * Two aligned layers: empty sockets keyed by slot index underneath, and
   * the ice keyed by instance on top. Keeping them separate lets ice enter,
   * leave and shift between sockets without the sockets themselves
   * animating.
   */
  return (
    <div className="flex flex-col gap-2.5" style={{ width: iceSize.w }}>
      {/* The header is the run target selector: the highlighted server is where the next run goes */}
      <button
        aria-pressed={isSelected}
        className={clsx(
          "font-orbitron flex items-center justify-between rounded-md border px-3 py-2 font-bold transition-colors",
          isSelected
            ? "border-cyan-400/40 bg-neutral-800 text-cyan-100"
            : "border-transparent bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300",
        )}
        type="button"
        onClick={handleServerClick}
      >
        <span className="text-sm">{server}</span>
        <span className="text-[0.5rem] tracking-[0.25em] uppercase opacity-70">
          {isSelected ? "target" : "server"}
        </span>
      </button>

      <div className="relative">
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: serverMaxIceSlots }).map((_, index) => (
            <div
              className="rounded-md border border-dashed border-white/10"
              key={index}
              style={slotStyle}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {serverIce.map((ice) => (
              <motion.div
                layout
                animate="installed"
                className="relative"
                exit="pulled"
                initial="installing"
                key={ice.instanceId}
                style={slotStyle}
                transition={{
                  layout: { damping: 32, stiffness: 420, type: "spring" },
                }}
                variants={ICE_SLOT_VARIANTS}
              >
                <CardFront
                  card={ice}
                  isBeingEncountered={
                    serverCurrentEncounteredIce?.instanceId === ice.instanceId
                  }
                  onClick={() => handleIceClick(ice.instanceId)}
                />
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-md bg-white"
                  variants={LANDING_FLASH_VARIANTS}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
