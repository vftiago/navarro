import { Flex } from "@mantine/core";
import { CardFront } from "./CardFront";
import { PlayingCardT } from "./cards/cards";

export const ServerRow = ({ serverCards }: { serverCards: PlayingCardT[] }) => {
  return (
    <Flex className="relative ml-50">
      {serverCards.map((card, index) => {
        return (
          <div key={index} className="-ml-50">
            <CardFront card={card} size="md" />
          </div>
        );
      })}
    </Flex>
  );
};
