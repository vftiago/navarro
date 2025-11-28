import { Flex, Stack } from "@mantine/core";
import { useGameStore } from "../store/gameStore";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";
import { IceUnitSlot } from "./IceUnitSlot";

const ICE_SLOTS = 3;

export const IceRow = () => {
  const serverInstalledIce = useGameStore(
    (state) => state.serverState.serverInstalledIce,
  );

  return (
    <Flex className="flex-row-reverse" gap="xs">
      {Array.from({ length: ICE_SLOTS }).map((_, index) => {
        return (
          <Stack
            className="bg-neutral-900 p-2.5 rounded-xl flex-col-reverse"
            gap="xs"
            key={index}
          >
            {serverInstalledIce[index] ? (
              serverInstalledIce[index].isRezzed ? (
                <CardFront card={serverInstalledIce[index]} />
              ) : (
                <CardBack />
              )
            ) : (
              <IceUnitSlot index={index} />
            )}
          </Stack>
        );
      })}
    </Flex>
  );
};
