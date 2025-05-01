import { Card, Image, Stack, Text } from "@mantine/core";
import { ProgramCardDefinitions } from "../../../cardDefinitions/card";
import { CARD_SIZES } from "../cardSizes";
import { CardTitle } from "./components/CardTitle";
import { CardEffects } from "./components/CardEffects";
import { CardTypeLine } from "./components/CardTypeLine";

export const CardFrontProgram = ({
  card,
  size,
}: {
  card: ProgramCardDefinitions;
  size: "xs" | "sm" | "md";
}) => {
  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

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
        <CardTitle name={name} />
      </Card.Section>

      <Card.Section>
        <Image
          alt={name}
          h={`${CARD_SIZES[size].h / 2}rem`}
          loading="eager"
          src={`./assets/${image}`}
        />
      </Card.Section>
      <Card.Section>
        <CardTypeLine
          rarity={rarity}
          size={size}
          subtype={subtype}
          type={type}
        />
      </Card.Section>
      <Stack align="center" gap="0.25rem" h="100%" justify="center" p="sm">
        <CardEffects cardEffects={cardEffects} size={size} />
        {flavorText ? (
          <Text className="italic" size={size}>
            {flavorText}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
};
