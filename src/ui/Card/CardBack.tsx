import { Card, Image } from "@mantine/core";
import { getCardSize } from "../../state/selectors";
import { useGameState } from "../../context/useGameState";

const GREY_CARD_BACK = "_787cb567-ce4a-463a-b131-08522b7b43c1.jpeg";

export const CardBack = ({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) => {
  const { gameState } = useGameState();

  const cardSize = getCardSize(gameState);

  return (
    <Card
      {...cardSize}
      withBorder
      className="hover:border-amber-100"
      padding="0"
      radius="md"
      shadow="lg"
      style={{ transform: orientation === "horizontal" ? "rotate(90deg)" : "" }}
    >
      <Card.Section>
        <Image
          alt="Card back"
          {...cardSize}
          src={`./assets/${GREY_CARD_BACK}`}
        />
      </Card.Section>
    </Card>
  );
};
