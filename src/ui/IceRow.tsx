import { Flex } from "@mantine/core";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";
import { GameState } from "../gameReducer";

export const IceRow = ({ gameState }: { gameState: GameState }) => {
  const serverCards = gameState.server.ice;

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl justify-end" gap="1rem">
      {serverCards.map((card, index) => {
        return (
          <div key={index}>
            <CardFront card={card} gameState={gameState} size="sm" />
          </div>
        );
      })}
      <CardBack size="sm" />
    </Flex>
  );
};
