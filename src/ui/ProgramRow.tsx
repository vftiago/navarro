import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { CardType } from "../cards/enums";
import { resolveCard } from "../cards/instance";
import { GameEventType, useEventBus } from "../state/events";
import { getPlayerMemoryUsed } from "../state/player";
import { getProgramChipSize } from "../state/settings";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { getEncounterBreakers } from "../state/utils";
import { CardFrontProgram } from "./Card/CardFront";

/*
 * Install: the chip settles onto its socket with a small spring, the same
 * gesture as ice landing on the wall. Trash: it drops away and fades.
 */
const CHIP_VARIANTS = {
  installed: {
    opacity: 1,
    scale: 1,
    transition: { damping: 26, stiffness: 520, type: "spring" as const },
    y: 0,
  },
  installing: { opacity: 0, scale: 1.06, y: -18 },
  trashed: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" as const },
    y: 24,
  },
};

/**
 * The rig: installed programs as chips in a row of sockets under the wall,
 * spanning exactly the servers' width (the parent shrink-wraps both rows), so
 * the wall, the rig and the hand share one vertical spine. Your programs
 * stand between you and the ice.
 *
 * Like the wall, two aligned layers: empty sockets keyed by slot index
 * underneath, chips keyed by instance on top, so chips can enter, leave and
 * shift without the sockets animating. Both layers are the same grid of
 * fixed-width tracks with the servers' gap, so the tracks exist whether or
 * not a chip fills them and the two layers always line up.
 */
export const ProgramRow = () => {
  const {
    playerInstalledPrograms,
    playerMemory,
    runProgressState,
    turnCurrentPhase,
    turnRemainingClicks,
  } = useGameStore(
    useShallow((state) => ({
      playerInstalledPrograms: state.playerState.playerInstalledPrograms,
      playerMemory: state.playerState.playerMemory,
      runProgressState: state.turnState.runProgressState,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
      turnRemainingClicks: state.turnState.turnRemainingClicks,
    })),
  );

  const eventBus = useEventBus();
  const chipSize = useGameStore(getProgramChipSize);
  const memoryUsed = useGameStore(getPlayerMemoryUsed);
  const isOverCapacity = memoryUsed > playerMemory;

  // Breakers that answer the encountered ice, by instance; empty outside an encounter
  const encounterBreakerIds = useGameStore(
    useShallow((state) =>
      getEncounterBreakers(state).map((program) => program.instanceId),
    ),
  );
  const isEncounterActive =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ENCOUNTERING_ICE;

  // Capacity can drop below what is installed; every chip still needs a socket
  const socketCount = Math.max(playerMemory, playerInstalledPrograms.length);

  const handleProgramClick = (instanceId: string) => {
    const program = playerInstalledPrograms.find(
      (installed) => installed.instanceId === instanceId,
    );

    if (!program) {
      return;
    }

    // UX gating only — the event handler is the authority on click rules
    if (isEncounterActive) {
      if (encounterBreakerIds.includes(instanceId)) {
        eventBus.emit({
          payload: { instanceId },
          type: GameEventType.CARD_CLICKED,
        });
      }

      return;
    }

    const definition = resolveCard(program);
    const ability =
      definition.type === CardType.PROGRAM
        ? definition.abilities?.[0]
        : undefined;

    if (
      !ability ||
      turnCurrentPhase !== TurnPhase.Main ||
      (ability.cost.clicks ?? 0) > turnRemainingClicks
    ) {
      return;
    }

    eventBus.emit({
      payload: { instanceId },
      type: GameEventType.CARD_CLICKED,
    });
  };

  const slotStyle = { height: chipSize.h, width: chipSize.w };
  const trackStyle = {
    gridTemplateColumns: `repeat(${String(socketCount)}, ${chipSize.w})`,
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Same header as a server's, minus the control: the rig is never a run target */}
      <div className="font-orbitron flex items-center justify-between rounded-md border border-transparent bg-neutral-900 px-3 py-2 font-bold text-neutral-400">
        <div className="flex items-baseline gap-3">
          <span className="text-sm">Rig</span>
          {/* Memory: MU in use over capacity; red once capacity has shrunk below what is installed */}
          <span
            className={clsx("text-sm tabular-nums", {
              "text-neutral-300": !isOverCapacity,
              "text-rose-300": isOverCapacity,
            })}
          >
            {memoryUsed}
            <span className="text-neutral-500">/{playerMemory}</span>
            <span className="ml-1 text-[0.5rem] tracking-[0.25em] text-neutral-500 uppercase">
              mu
            </span>
          </span>
        </div>
        <span className="text-[0.5rem] tracking-[0.25em] uppercase opacity-70">
          programs
        </span>
      </div>

      <div className="relative">
        <div className="grid gap-2.5" style={trackStyle}>
          {Array.from({ length: socketCount }).map((_, index) => (
            <div
              className="rounded-md border border-dashed border-white/10"
              key={index}
              style={slotStyle}
            />
          ))}
        </div>

        <div className="absolute inset-0 grid gap-2.5" style={trackStyle}>
          <AnimatePresence initial={false}>
            {playerInstalledPrograms.map((program) => {
              const definition = resolveCard(program);
              if (definition.type !== CardType.PROGRAM) {
                return null;
              }

              return (
                <motion.div
                  layout
                  animate="installed"
                  exit="trashed"
                  initial="installing"
                  key={program.instanceId}
                  style={slotStyle}
                  transition={{
                    layout: { damping: 32, stiffness: 420, type: "spring" },
                  }}
                  variants={CHIP_VARIANTS}
                >
                  <CardFrontProgram
                    definition={definition}
                    isBreakerForEncounter={encounterBreakerIds.includes(
                      program.instanceId,
                    )}
                    onClick={() => {
                      handleProgramClick(program.instanceId);
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
