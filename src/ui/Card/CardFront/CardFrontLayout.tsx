import { Card, Image, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";
import {
  CardEffect,
  CardRarity,
  IceSubtype,
  ProgramSubtype,
} from "../../../cardDefinitions/card";
import { getCardSize } from "../../../state/selectors";
import { getGameState } from "../../../store/gameStore";
import { CardEffects } from "./components/CardEffects";
import { CardTitle } from "./components/CardTitle";
import { CardTypeLine } from "./components/CardTypeLine";

type CardFrontLayoutProps = {
  cardEffects: CardEffect[];
  flavorText?: string;
  image: string;
  name: string;
  overlay?: ReactNode;
  rarity: CardRarity;
  subtype?: IceSubtype | ProgramSubtype;
  titleClassName?: string;
  type: string;
};

export const CardFrontLayout = ({
  cardEffects,
  flavorText,
  image,
  name,
  overlay,
  rarity,
  subtype,
  titleClassName,
  type,
}: CardFrontLayoutProps) => {
  const cardSize = getCardSize(getGameState());

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
        <CardTitle name={name} rootClassName={titleClassName} />
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
      {overlay}
    </Card>
  );
};
