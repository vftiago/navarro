import { Card } from "@mantine/core";
import { getCardSize } from "../../state/selectors";
import { getGameState } from "../../store/gameStore";

export const CardBack = ({
  orientation = "vertical",
}: {
  orientation?: "horizontal" | "vertical";
}) => {
  const cardSize = getCardSize(getGameState());

  return (
    <Card
      {...cardSize}
      withBorder
      className="hover:border-amber-100"
      padding="0"
      radius="md"
      shadow="lg"
      style={{ transform: orientation === "horizontal" ? "rotate(90deg)" : "" }}
    />
  );
};
