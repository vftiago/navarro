import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import { CardType } from "../../cards/card";
import { PlayingCardT } from "../../cards/card";
import { CARD_SIZES } from "./cardSizes";

export const CardFrontFullArt = ({
  card,
  size = "sm",
}: {
  card: PlayingCardT;
  size?: "sm" | "md";
}) => {
  const { image, name, type } = card;

  return (
    <Card
      withBorder
      className="select-none hover:cursor-pointer hover:border-cyan-200"
      h={`${CARD_SIZES[size].w}rem`}
      padding="0"
      radius="md"
      shadow="lg"
      w={`${CARD_SIZES[size].w}rem`}
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
        <Image alt={name} loading="eager" src={`./assets/${image}`} />
      </Card.Section>
    </Card>
  );
};
