import { Flex } from "@mantine/core";
import { useGameState } from "../context/useGameState";
import { CardFront } from "./Card/CardFront";
import { getPlayerInstalledPrograms } from "../state/selectors";

export const ProgramRow = () => {
  const { gameState } = useGameState();

  const installedPrograms = getPlayerInstalledPrograms(gameState);

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl h-[332px]" gap="xs">
      {installedPrograms.map((card, index) => (
        <CardFront key={index} card={card} size="xs" />
      ))}
    </Flex>
  );
};
