import { Stack } from "@mantine/core";
import { useGameState } from "../context/useGameState";
import { getCardSize } from "../state/selectors";

export const MemoryUnitSlot = ({ index }: { index: number }) => {
  const { gameState } = useGameState();

  const cardSize = getCardSize(gameState);

  return (
    <Stack
      className="items-center justify-center h-full font-orbitron font-bold"
      {...cardSize}
    >
      MU {index + 1}{" "}
    </Stack>
  );
};
