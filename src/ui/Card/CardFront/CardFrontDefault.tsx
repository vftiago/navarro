import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import {
  CardRarity,
  DefaultCardPropertiesT,
  TriggerMoment,
} from "../../../cards/card";
import { IoMdReturnRight } from "react-icons/io";
import { CARD_SIZES } from "../cardSizes";

export const CardFrontDefault = ({
  card,
  size,
}: {
  card: DefaultCardPropertiesT;
  size: "xs" | "sm" | "md";
}) => {
  const { cardEffects, image, name, rarity, type, flavorText } = card;

  const renderCardEffects = () => {
    if (!cardEffects) {
      return null;
    }

    const effects = cardEffects.map((effect, index) => {
      const isKeywordEffect = Boolean(effect.keyword);

      const isSubroutine = effect.triggerMoment === TriggerMoment.ON_ACCESS;

      const text = effect.getText();

      return isSubroutine ? (
        <Text
          key={index}
          className={isKeywordEffect ? "text-purple-300" : ""}
          fw="500"
          size="sm"
        >
          <IoMdReturnRight className="inline -mt-0.5" /> {text}
        </Text>
      ) : (
        <Text
          key={index}
          className={isKeywordEffect ? "text-purple-300" : ""}
          fw="500"
          size="sm"
        >
          {text}
        </Text>
      );
    });

    return effects;
  };

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
      <Stack align="center" justify="center">
        <Text fw={500} size="sm">
          {name}
        </Text>
      </Stack>
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
        px="sm"
      >
        <Text size="xs">
          {rarity} {type}
        </Text>
      </Card.Section>
      <Stack align="center" gap="0.25rem" h="100%" justify="center" p="md">
        {renderCardEffects()}
        {flavorText ? (
          <Text className="italic" size="xs">
            {flavorText}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
};
