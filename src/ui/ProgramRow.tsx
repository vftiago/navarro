import { Flex } from "@mantine/core";
import { useGameState } from "../context/useGameState";
import { CardFront } from "./Card/CardFront";

export const ProgramRow = () => {
  const { gameState } = useGameState();
  const { playerState } = gameState;

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl h-[308px]" gap="xs">
      {playerState.playerInstalledPrograms.map((card, index) => (
        <CardFront key={index} card={card} />
      ))}
    </Flex>
  );
};
