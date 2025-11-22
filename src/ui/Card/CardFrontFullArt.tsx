import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import { CardType } from "../../cardDefinitions/card";
import { PlayingCard } from "../../cardDefinitions/card";
import { useGameState } from "../../context/useGameState";
import { getCardSize } from "../../state/selectors";

export const CardFrontFullArt = ({ card }: { card: PlayingCard }) => {
  const { image, name, type } = card;

  const { gameState } = useGameState();

  const cardSize = getCardSize(gameState);

  return (
    <Card
      withBorder
      className="select-none hover:cursor-pointer hover:border-cyan-200"
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
        <Image alt={name} loading="eager" src={`./assets/${image}`} />
      </Card.Section>
    </Card>
  );
};
