import { Card } from "@mantine/core";
import { getCardSize } from "../../state/settings";
import { getGameState } from "../../state/store";

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
