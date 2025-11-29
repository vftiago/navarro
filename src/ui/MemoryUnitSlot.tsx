import { Stack } from "@mantine/core";
import { getCardSize } from "../state/settings";
import { getGameState } from "../state/store";

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
