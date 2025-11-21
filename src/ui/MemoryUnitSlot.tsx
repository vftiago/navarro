import { Stack } from "@mantine/core";
import { CARD_SIZES } from "./Card/cardSizes";

const CARD_SIZE = "xs";

export const MemoryUnitSlot = ({ index }: { index: number }) => {
  return (
    <Stack
      className="items-center justify-center h-full font-orbitron font-bold"
      w={`${CARD_SIZES[CARD_SIZE].w}rem`}
    >
      MU {index + 1}{" "}
    </Stack>
  );
};
