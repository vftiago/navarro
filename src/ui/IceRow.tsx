import { Flex } from "@mantine/core";
import { IcePlayingCard } from "../cardDefinitions/card";
import { useGameStore } from "../store/gameStore";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";

export const IceRow = () => {
  const serverInstalledIce = useGameStore(
    (state) => state.serverState.serverInstalledIce,
  );

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl justify-end " gap="xs">
      {serverInstalledIce.map((card: IcePlayingCard, index: number) => {
        return card.isRezzed ? (
          <CardFront card={card} key={index} />
        ) : (
          <CardBack key={index} />
        );
      })}
      <CardBack />
    </Flex>
  );
};
