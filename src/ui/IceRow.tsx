import { Flex, Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { getIceCardSize } from "../state/settings";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";

export const IceRow = () => {
  const {
    runProgressState,
    selectedServer,
    serverCurrentEncounteredIce,
    serverMaxIceSlots,
    servers,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      runProgressState: state.turnState.runProgressState,
      selectedServer: state.serverState.selectedServer,
      serverCurrentEncounteredIce:
        state.serverState.serverCurrentEncounteredIce,
      serverMaxIceSlots: state.serverState.serverMaxIceSlots,
      servers: state.serverState.servers,
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

  const serverIce = servers[selectedServer].installedIce;

  /*
   * The wall is a column: the server on top, then ice from innermost
   * (index 0) down to outermost. The run encounters the outermost
   * ice first, so the ice nearest the player is the one they hit next.
   */
  return (
    <Stack gap="xs" style={{ width: iceSize.w }}>
      <Flex
        align="center"
        className="font-orbitron rounded-md bg-neutral-900 px-3 py-2 font-bold"
        justify="space-between"
      >
        <span className="text-sm">{selectedServer}</span>
        <span className="text-[0.5rem] tracking-[0.25em] text-neutral-500 uppercase">
          server
        </span>
      </Flex>
      {Array.from({ length: serverMaxIceSlots }).map((_, index) => {
        // May be out of bounds — fewer ice than slots
        const ice = serverIce.at(index);
        const isBeingEncountered =
          ice && serverCurrentEncounteredIce?.instanceId === ice.instanceId;

        return ice ? (
          <CardFront
            card={ice}
            isBeingEncountered={isBeingEncountered}
            key={ice.instanceId}
            onClick={() => handleIceClick(ice.instanceId)}
          />
        ) : (
          <div
            className="h-2 rounded-md border border-dashed border-white/10"
            key={index}
          />
        );
      })}
    </Stack>
  );
};
