import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import { CardType, PlayingCard } from "../../cardDefinitions/card";
import { getCardSize } from "../../state/settings";
import { getGameState } from "../../state/store";
import { CardHoverEffect } from "./CardHoverEffect";

export const CardFrontFullArt = ({ card }: { card: PlayingCard }) => {
  const { image, name, type } = card;

  const cardSize = getCardSize(getGameState());

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
        <Stack align="center" justify="center">
          <Text
            className={clsx({
              "text-yellow-300": type === CardType.AGENDA,
            })}
            fw={500}
            size="sm"
          >
            {name}
          </Text>
        </Stack>
        <Card.Section>
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
