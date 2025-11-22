import { Card, Image, Stack, Text } from "@mantine/core";
import { ProgramCardDefinitions } from "../../../cardDefinitions/card";
import { CardTitle } from "./components/CardTitle";
import { CardEffects } from "./components/CardEffects";
import { CardTypeLine } from "./components/CardTypeLine";
import { useGameState } from "../../../context/useGameState";
import { getCardSize } from "../../../state/selectors";

export const CardFrontProgram = ({
  card,
}: {
  card: ProgramCardDefinitions;
}) => {
  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

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
      <Card.Section>
        <CardTitle name={name} />
      </Card.Section>
      <Card.Section className="h-1/2">
        <Image
          alt={name}
          className="h-full"
          loading="eager"
          src={`./assets/${image}`}
        />
      </Card.Section>
      <Card.Section>
        <CardTypeLine rarity={rarity} subtype={subtype} type={type} />
      </Card.Section>
      <Stack align="center" gap="0.25rem" h="100%" justify="center" p="sm">
        <CardEffects cardEffects={cardEffects} />
        {flavorText ? (
          <Text className="italic" size="xs">
            {flavorText}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
};
