import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import {
  CardRarity,
  CardType,
  IceCardDefinitions,
} from "../../../cardDefinitions/card";
import { CARD_SIZES } from "../cardSizes";
import { useGameState } from "../../../context/useGameState";
import { CardTitle } from "./components/CardTitle";
import { CardEffects } from "./components/CardEffects";

export const CardFrontIce = ({
  card,
  size,
}: {
  card: IceCardDefinitions;
  size: "xs" | "sm" | "md";
}) => {
  const { gameState } = useGameState();

  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

  const isICE = type === CardType.ICE;

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
      <Card.Section
        className={clsx({
          "bg-gray-900": rarity === CardRarity.BASIC,
          "bg-gray-600": rarity === CardRarity.COMMON,
          "bg-cyan-600": rarity === CardRarity.UNCOMMON,
          "bg-indigo-500": rarity === CardRarity.RARE,
        })}
        px={size}
      >
        <Text size={size}>
          {rarity} {type}
          {subtype ? ` — ${subtype}` : ""}
        </Text>
      </Card.Section>
      <Stack align="center" gap="0.25rem" h="100%" justify="center" p={size}>
        <CardEffects cardEffects={cardEffects} size={size} />
        {flavorText ? (
          <Text className="italic" size={size}>
            {flavorText}
          </Text>
        ) : null}
      </Stack>
      {isICE ? (
        <div className="absolute flex items-center font-bold justify-center border-1 border-gray-500 rounded-md size-6 right-0 m-1 bottom-0">
          {card.getStrength(gameState)}
        </div>
      ) : null}
    </Card>
  );
};
