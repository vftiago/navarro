import { Flex } from "@mantine/core";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";
import { useGameState } from "../context/useGameState";

export const IceRow = () => {
  const {
    gameState: { server },
  } = useGameState();

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl justify-end" gap="1rem">
      {server.ice.map((card, index) => {
        return (
          <div key={index}>
            <CardFront card={card} size="sm" />
          </div>
        );
      })}
      <CardBack size="sm" />
    </Flex>
  );
};
