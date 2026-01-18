import { Flex, Stack, Text, UnstyledButton } from "@mantine/core";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { ServerName, setSelectedServer } from "../state/server";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";
import { IceUnitSlot } from "./IceUnitSlot";

// Order: HQ (top) → R&D → Archives (bottom)
const ALL_SERVERS = [ServerName.HQ, ServerName.RD, ServerName.ARCHIVES];

export const IceRow = () => {
  const {
    dispatch,
    runProgressState,
    selectedServer,
    serverCurrentEncounteredIce,
    serverMaxIceSlots,
    servers,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      dispatch: state.dispatch,
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

  const currentIndex = ALL_SERVERS.indexOf(selectedServer);
  const isAtTop = currentIndex === 0;
  const isAtBottom = currentIndex === ALL_SERVERS.length - 1;

  const isEncounterActive =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ENCOUNTERING_ICE;

  const isRunning = turnCurrentPhase === TurnPhase.Run;

  const handleIceClick = (iceId: string) => {
    if (
      isEncounterActive &&
      serverCurrentEncounteredIce?.deckContextId === iceId
    ) {
      eventBus.emit({
        payload: { iceId },
        type: GameEventType.PLAYER_CLICK_ICE,
      });
    }
  };

  const handleServerChange = (dir: "up" | "down") => {
    if (isRunning) return;
    if (dir === "up" && isAtTop) return;
    if (dir === "down" && isAtBottom) return;

    const newIndex = dir === "up" ? currentIndex - 1 : currentIndex + 1;
    dispatch(setSelectedServer(ALL_SERVERS[newIndex]));
  };

  const selectedServerIce = servers[selectedServer].installedIce;

  return (
    <Flex className="flex-row-reverse" gap="xs">
      <Stack
        align="center"
        className="w-[100px] rounded-md bg-neutral-900"
        gap={0}
        justify="stretch"
      >
        <UnstyledButton
          className="flex w-full flex-1 items-center justify-center rounded-t-md transition-colors hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={isRunning || isAtTop}
          onClick={() => handleServerChange("up")}
        >
          <FaChevronUp size={24} />
        </UnstyledButton>
        <Text className="font-orbitron text-center text-sm font-bold">
          {selectedServer}
        </Text>
        <UnstyledButton
          className="flex w-full flex-1 items-center justify-center rounded-b-md transition-colors hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={isRunning || isAtBottom}
          onClick={() => handleServerChange("down")}
        >
          <FaChevronDown size={24} />
        </UnstyledButton>
      </Stack>
      <Flex className="flex-row-reverse" gap="xs">
        {Array.from({ length: serverMaxIceSlots }).map((_, index) => {
          const ice = selectedServerIce[index];
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
                <CardFront
                  card={ice}
                  isBeingEncountered={isBeingEncountered}
                  onClick={() => handleIceClick(ice.deckContextId)}
                />
              ) : (
                <IceUnitSlot index={index} />
              )}
            </Stack>
          );
        })}
      </Flex>
    </Flex>
  );
};
