import { Flex, Stack } from "@mantine/core";
import { useGameState } from "../context/useGameState";
import { CardFront } from "./Card/CardFront";
import { MemoryUnitSlot } from "./MemoryUnitSlot";

export const ProgramRow = () => {
  const { gameState } = useGameState();
  const {
    playerState: { playerInstalledPrograms, playerMemory },
  } = gameState;

  return (
    <Flex gap="xs">
      {Array.from({ length: playerMemory }).map((_, index) => {
        return (
          <Stack
            className="bg-neutral-900 p-2.5 rounded-xl h-[308px]"
            gap="xs"
            key={index}
          >
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
