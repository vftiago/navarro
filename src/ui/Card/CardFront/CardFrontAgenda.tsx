import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import {
  AgendaCardDefinitions,
  CardRarity,
  TriggerMoment,
} from "../../../cardDefinitions/card";
import { IoMdReturnRight } from "react-icons/io";
import { CARD_SIZES } from "../cardSizes";
import { CardTitle } from "./components/CardTitle";

export const CardFrontAgenda = ({
  card,
  size,
}: {
  card: AgendaCardDefinitions;
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
          size={size}
        >
          <IoMdReturnRight className="inline -mt-0.5" /> {text}
        </Text>
      ) : (
        <Text
          key={index}
          className={isKeywordEffect ? "text-purple-300" : ""}
          fw="500"
          size={size}
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
        </Text>
      </Card.Section>
      <Card.Section>
        <Stack align="center" gap="0.25rem" h="100%" justify="center" p={size}>
          {renderCardEffects()}
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
