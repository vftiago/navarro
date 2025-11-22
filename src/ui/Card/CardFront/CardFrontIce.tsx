import { Card, Image, Stack, Text } from "@mantine/core";
import { IcePlayingCard } from "../../../cardDefinitions/card";
import { useGameState } from "../../../context/useGameState";
import { CardTitle } from "./components/CardTitle";
import { CardEffects } from "./components/CardEffects";
import { CardTypeLine } from "./components/CardTypeLine";
import { getCardSize, getIceStrength } from "../../../state/selectors";
import clsx from "clsx";

export const CardFrontIce = ({ card }: { card: IcePlayingCard }) => {
  const { gameState } = useGameState();

  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

  const currentStrenght = getIceStrength(gameState, card);

  const cardSize = getCardSize(gameState);

  const baseStrength = card.getStrength(gameState);

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
      <Card.Section flex={1}>
        <Stack align="center" gap="0.25rem" h="100%" justify="center" p="xs">
          <CardEffects cardEffects={cardEffects} />
          {flavorText ? (
            <Text className="italic" size="xs">
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
