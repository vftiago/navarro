import { Card, Image, Stack, Text } from "@mantine/core";
import { IcePlayingCard } from "../../../cardDefinitions/card";
import { CARD_SIZES } from "../cardSizes";
import { useGameState } from "../../../context/useGameState";
import { CardTitle } from "./components/CardTitle";
import { CardEffects } from "./components/CardEffects";
import { CardTypeLine } from "./components/CardTypeLine";
import { getIceStrength } from "../../../state/selectors";
import clsx from "clsx";

export const CardFrontIce = ({
  card,
  size,
}: {
  card: IcePlayingCard;
  size: "xs" | "sm" | "md";
}) => {
  const { gameState } = useGameState();

  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

  const currentStrenght = getIceStrength(gameState, card);

  const baseStrength = card.getStrength(gameState);

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
      <div
        className={clsx(
          "absolute flex items-center font-bold justify-center border-1 border-gray-500 rounded-md size-6 right-0 m-1 bottom-0",
          {
            "text-green-300": currentStrenght > baseStrength,
            "text-red-300": currentStrenght < baseStrength,
          },
        )}
      >
        {currentStrenght}
      </div>
    </Card>
  );
};
