import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import {
  CardRarity,
  EffectCost,
  ProgramCardDefinitions,
} from "../../../cardDefinitions/card";
import { CARD_SIZES } from "../cardSizes";
import { TbClock2, TbTrash } from "react-icons/tb";

const renderEffectCost = (cost: EffectCost) => {
  switch (cost) {
    case EffectCost.TRASH:
      return <TbTrash className="inline -mt-0.5" />;
    case EffectCost.CLICK:
      return <TbClock2 className="inline" />;

    default:
      return null;
  }
};

export const CardFrontProgram = ({
  card,
  size,
}: {
  card: ProgramCardDefinitions;
  size: "xs" | "sm" | "md";
}) => {
  const { cardEffects, image, name, rarity, type, subtype, flavorText } = card;

  const renderCardEffects = () => {
    if (!cardEffects) {
      return null;
    }

    const effects = cardEffects.map((effect, index) => {
      const isKeywordEffect = Boolean(effect.keyword);

      const { getText, cost } = effect;

      return (
        <Text key={index} fw="500" size="xs">
          {cost ? (
            <span className="inline mr-1">{renderEffectCost(cost)}:</span>
          ) : null}
          <span
            className={clsx("inline", {
              "text-purple-300": isKeywordEffect,
            })}
          >
            {getText()}
          </span>
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
          {subtype ? ` — ${subtype}` : ""}
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
