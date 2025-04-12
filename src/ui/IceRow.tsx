import { Flex } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { useGameState } from "../context/useGameState";
import { CardType } from "../cards/card";
import { CardBack } from "./Card/CardBack";

export const IceRow = () => {
  const {
    gameState: { server },
  } = useGameState();

  const ice = server.ice.filter((card) => card.type === CardType.ICE);

  return (
    <Flex
      className="bg-neutral-900 p-2.5 rounded-xl justify-end h-[332px]"
      gap="xs"
    >
      {ice.map((card, index) => {
        return card.rezzed ? (
          <CardFront key={index} card={card} size="xs" />
        ) : (
          <CardBack key={index} size="xs" />
        );
      })}
    </Flex>
  );
};
