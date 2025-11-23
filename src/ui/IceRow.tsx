import { Flex } from "@mantine/core";
import { IcePlayingCard } from "../cardDefinitions/card";
import { useGameState } from "../context/useGameState";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";

export const IceRow = () => {
  const { gameState } = useGameState();

  return (
    <Flex
      className="bg-neutral-900 p-2.5 rounded-xl justify-end h-[308px]"
      gap="xs"
    >
      {gameState.serverState.serverInstalledIce.map(
        (card: IcePlayingCard, index: number) => {
          return card.isRezzed ? (
            <CardFront card={card} key={index} />
          ) : (
            <CardBack key={index} />
          );
        },
      )}
    </Flex>
  );
};
