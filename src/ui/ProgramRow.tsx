import { Flex, Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";
import { CardFront } from "./Card/CardFront";
import { MemoryUnitSlot } from "./MemoryUnitSlot";

export const ProgramRow = () => {
  const { playerInstalledPrograms, playerMemory } = useGameStore(
    useShallow((state) => ({
      playerInstalledPrograms: state.playerState.playerInstalledPrograms,
      playerMemory: state.playerState.playerMemory,
    })),
  );

  return (
    <Flex gap="xs">
      {Array.from({ length: playerMemory }).map((_, index) => {
        return (
          <Stack className="rounded-md bg-neutral-900" gap="xs" key={index}>
            {playerInstalledPrograms[index] ? (
              <CardFront card={playerInstalledPrograms[index]} />
            ) : (
              <MemoryUnitSlot index={index} />
            )}
          </Stack>
        );
      })}
    </Flex>
  );
};
