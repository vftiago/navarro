import { Card, Image, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import {
  type CardEffect,
  type CardRarity,
  type CardType,
  type IceSubtype,
  type ProgramSubtype,
} from "../../../cardDefinitions/card";
import { CardBase } from "../CardBase";
import { CardEffects } from "./components/CardEffects";
import { CardTitle } from "./components/CardTitle";
import { CardTypeLine } from "./components/CardTypeLine";

type CardFrontLayoutProps = {
  cardEffects: CardEffect[];
  flavorText?: string;
  image: string;
  isBeingEncountered?: boolean;
  name: string;
  onClick?: () => void;
  overlay?: ReactNode;
  rarity: CardRarity;
  subtype?: IceSubtype | ProgramSubtype;
  titleClassName?: string;
  type: CardType;
};

export const CardFrontLayout = ({
  cardEffects,
  flavorText,
  image,
  isBeingEncountered,
  name,
  onClick,
  overlay,
  rarity,
  subtype,
  titleClassName,
  type,
}: CardFrontLayoutProps) => {
  return (
    <CardBase
      isBeingEncountered={isBeingEncountered}
      type={type}
      onClick={onClick}
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
    </CardBase>
  );
};
