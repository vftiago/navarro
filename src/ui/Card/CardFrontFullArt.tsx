import { Card, Image, Text } from "@mantine/core";
import clsx from "clsx";
import { CardType } from "../../cardDefinitions/card";
import type { CardDefinition } from "../../cards/definitions";
import { getCardSize } from "../../state/settings";
import { useGameStore } from "../../state/store";
import { CardHoverEffect } from "./CardHoverEffect";

export const CardFrontFullArt = ({
  definition,
}: {
  definition: CardDefinition;
}) => {
  const { image, name, type } = definition;

  const cardSize = useGameStore(getCardSize);

  return (
    <CardHoverEffect type={type}>
      <Card
        withBorder
        className="select-none hover:cursor-pointer"
        padding="0"
        radius="md"
        shadow="lg"
        {...cardSize}
      >
        <Card.Section>
          <Text
            className={clsx(
              "absolute flex w-full justify-center text-sm font-bold text-shadow-md text-shadow-neutral-950",
              {
                "text-yellow-300": type === CardType.AGENDA,
              },
            )}
          >
            {name}
          </Text>
          <Image
            alt={name}
            {...cardSize}
            loading="eager"
            src={`./assets/${image}`}
          />
        </Card.Section>
      </Card>
    </CardHoverEffect>
  );
};
