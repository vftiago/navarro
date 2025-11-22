import { Card, Image, Stack, Text } from "@mantine/core";
import { AgendaCardDefinitions } from "../../../cardDefinitions/card";
import { CardTitle } from "./components/CardTitle";
import { CardTypeLine } from "./components/CardTypeLine";
import { CardEffects } from "./components/CardEffects";
import { useGameState } from "../../../context/useGameState";
import { getCardSize } from "../../../state/selectors";

export const CardFrontAgenda = ({ card }: { card: AgendaCardDefinitions }) => {
  const { cardEffects, image, name, rarity, type, flavorText } = card;

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
        <CardTitle name={name} rootClassName="text-yellow-300" />
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
        <CardTypeLine rarity={rarity} type={type} />
      </Card.Section>
      <Card.Section flex={1}>
        <Stack align="center" gap="0.25rem" h="100%" justify="center" p="xs">
          <CardEffects cardEffects={cardEffects} />
          {flavorText ? <Text className="italic">{flavorText}</Text> : null}
        </Stack>
      </Card.Section>
    </Card>
  );
};
