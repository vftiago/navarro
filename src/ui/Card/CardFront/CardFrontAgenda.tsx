import { Card, Image, Stack, Text } from "@mantine/core";
import { AgendaCardDefinitions } from "../../../cardDefinitions/card";
import { CARD_SIZES } from "../cardSizes";
import { CardTitle } from "./components/CardTitle";
import { CardTypeLine } from "./components/CardTypeLine";
import { CardEffects } from "./components/CardEffects";

export const CardFrontAgenda = ({
  card,
  size,
}: {
  card: AgendaCardDefinitions;
  size: "xs" | "sm" | "md";
}) => {
  const { cardEffects, image, name, rarity, type, flavorText } = card;

  return (
    <Card
      withBorder
      className="select-none hover:cursor-pointer hover:border-cyan-200"
      h={`${CARD_SIZES[size].h}rem`}
      padding="0"
      radius="md"
      shadow="lg"
      w={`${CARD_SIZES[size].w}rem`}
    >
      <Card.Section>
        <CardTitle name={name} rootClassName="text-yellow-300" />
      </Card.Section>
      <Card.Section>
        <Image
          h={`${CARD_SIZES[size].h / 2}rem`}
          loading="eager"
          src={`./assets/${image}`}
        />
      </Card.Section>
      <Card.Section>
        <CardTypeLine rarity={rarity} size={size} type={type} />
      </Card.Section>
      <Card.Section flex={1}>
        <Stack align="center" gap="0.25rem" h="100%" justify="center" p={size}>
          <CardEffects cardEffects={cardEffects} size={size} />
          {flavorText ? (
            <Text className="italic" size={size}>
              {flavorText}
            </Text>
          ) : null}
        </Stack>
      </Card.Section>
    </Card>
  );
};
