import { Flex } from "@mantine/core";
import { CardFront } from "./CardFront";
import { CardT } from "./cards/cards";

export const ServerRow = ({ serverCards }: { serverCards: CardT[] }) => {
  return (
    <Flex className="relative ml-20">
      {serverCards.map((card, index) => {
        return (
          <div onMouseEnter={() => {}} className={`-ml-20`} key={index}>
            <CardFront card={card} size="md" />
          </div>
        );
      })}
    </Flex>
  );
};
