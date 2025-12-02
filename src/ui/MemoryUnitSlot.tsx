import { Stack } from "@mantine/core";
import { getCardSize } from "../state/settings";
import { getGameState } from "../state/store";

export const MemoryUnitSlot = ({ index }: { index: number }) => {
  const cardSize = getCardSize(getGameState());

  return (
    <Stack
      className="font-orbitron h-full items-center justify-center font-bold"
      {...cardSize}
    >
      MU {index + 1}{" "}
    </Stack>
  );
};
