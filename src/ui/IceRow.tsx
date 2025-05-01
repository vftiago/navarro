import { Flex } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { useGameState } from "../context/useGameState";
import { IcePlayingCard } from "../cardDefinitions/card";
import { CardBack } from "./Card/CardBack";

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
            <CardFront key={index} card={card} />
          ) : (
            <CardBack key={index} />
          );
        },
      )}
    </Flex>
  );
};
