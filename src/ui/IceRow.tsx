import { Flex } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { CardBack } from "./Card/CardBack";
import { useGameState } from "../context/useGameState";
import { getServerInstalledIce } from "../state/selectors";

export const IceRow = () => {
  const { gameState } = useGameState();

  const installedIce = getServerInstalledIce(gameState);

  return (
    <Flex
      className="bg-neutral-900 p-2.5 rounded-xl justify-end h-[332px]"
      gap="xs"
    >
      {installedIce.map((card, index) => {
        return card.isRezzed ? (
          <CardFront key={index} card={card} size="xs" />
        ) : (
          <CardBack key={index} size="xs" />
        );
      })}
    </Flex>
  );
};
