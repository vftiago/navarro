import { Flex, Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";
import { IceUnitSlot } from "./IceUnitSlot";

export const IceRow = () => {
  const {
    runProgressState,
    serverCurrentEncounteredIce,
    serverInstalledIce,
    serverMaxIceSlots,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      runProgressState: state.turnState.runProgressState,
      serverCurrentEncounteredIce:
        state.serverState.serverCurrentEncounteredIce,
      serverInstalledIce: state.serverState.serverInstalledIce,
      serverMaxIceSlots: state.serverState.serverMaxIceSlots,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  const eventBus = useEventBus();

  const isEncounterActive =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ENCOUNTERING_ICE;

  const handleIceClick = (iceId: string) => {
    if (
      isEncounterActive &&
      serverCurrentEncounteredIce?.deckContextId === iceId
    ) {
      // Emit event to click ice
      // Event handler will validate and increment phase counter
      eventBus.emit({
        payload: { iceId },
        type: GameEventType.PLAYER_CLICK_ICE,
      });
    }
  };

  return (
    <Flex className="flex-row-reverse" gap="xs">
      <Stack className="flex-col-reverse rounded-md bg-neutral-900" gap="xs">
        <CardBack />
      </Stack>
      {Array.from({ length: serverMaxIceSlots }).map((_, index) => {
        const ice = serverInstalledIce[index];
        const isBeingEncountered =
          ice &&
          serverCurrentEncounteredIce?.deckContextId === ice.deckContextId;

        return (
          <Stack
            className="flex-col-reverse rounded-md bg-neutral-900"
            gap="xs"
            key={index}
          >
            {ice ? (
              ice.isRezzed ? (
                <CardFront
                  card={ice}
                  isBeingEncountered={isBeingEncountered}
                  onClick={() => handleIceClick(ice.deckContextId)}
                />
              ) : (
                <CardBack />
              )
            ) : (
              <IceUnitSlot index={index} />
            )}
          </Stack>
        );
      })}
    </Flex>
  );
};
