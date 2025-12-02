import { Card, Image } from "@mantine/core";
import { getCardSize } from "../../state/settings";
import { getGameState } from "../../state/store";
import { CardHoverEffect } from "./CardHoverEffect";

export const CardBack = () => {
  const cardSize = getCardSize(getGameState());

  return (
    <CardHoverEffect>
      <Card
        withBorder
        className="rounded-md select-none hover:cursor-pointer"
        padding="0"
        {...cardSize}
      >
        <Card.Section>
          <Image
            {...cardSize}
            loading="eager"
            src={`./assets/_95bdd40b-cd24-4f75-9b35-75fb07f19cf3.jpg`}
          />
        </Card.Section>
      </Card>
    </CardHoverEffect>
  );
};
