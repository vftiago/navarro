import { Stack } from "@mantine/core";
import { getCardSize } from "../state/selectors";
import { getGameState } from "../store/gameStore";

export const MemoryUnitSlot = ({ index }: { index: number }) => {
  const cardSize = getCardSize(getGameState());

  return (
    <Stack
      className="items-center justify-center h-full font-orbitron font-bold"
      {...cardSize}
    >
      MU {index + 1}{" "}
    </Stack>
  );
};
