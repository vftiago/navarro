import { Stack } from "@mantine/core";
import { getCardSize } from "../state/selectors";
import { getGameState } from "../store/gameStore";

export const IceUnitSlot = ({ index }: { index: number }) => {
  const cardSize = getCardSize(getGameState());

  return (
    <Stack
      className="items-center justify-center h-full font-orbitron font-bold"
      {...cardSize}
    >
      ICE {index + 1}
    </Stack>
  );
};
