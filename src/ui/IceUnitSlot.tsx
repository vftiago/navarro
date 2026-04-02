import { Stack } from "@mantine/core";
import { getCardSize } from "../state/settings";
import { useGameStore } from "../state/store";

export const IceUnitSlot = ({ index }: { index: number }) => {
  const cardSize = useGameStore(getCardSize);

  return (
    <Stack
      className="font-orbitron h-full items-center justify-center font-bold"
      {...cardSize}
    >
      ICE {index + 1}
    </Stack>
  );
};
