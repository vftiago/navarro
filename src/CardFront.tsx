import { Card, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import { SizeT, sizes } from "./cardSizes";
import { CardRarityT, CardTypeT } from "./cards/cards";
import { CardT } from "./cards/cards";

export const CardFront = ({
  card,
  size = "md",
}: {
  card: CardT;
  size?: SizeT;
}) => {
  const { effects, image, name, rarity, type } = card;

  const isMedium = size !== "xs";

  return (
    <Card
      withBorder
      className="select-none hover:cursor-pointer hover: hover:border-cyan-200"
      h={sizes[size].h}
      padding="0"
      radius="md"
      shadow="lg"
      w={sizes[size].w}
    >
      {isMedium && (
        <Stack align="center" justify="center">
          <Text
            className={clsx({
              "text-yellow-300": type === CardTypeT.AGENDA,
            })}
            fw={700}
          >
            {name}
          </Text>
        </Stack>
      )}
      <Card.Section>
        <Image
          alt={name}
          h={sizes[size].h / (isMedium ? 2 : 1)}
          src={`./assets/${image}`}
        />
      </Card.Section>
      {isMedium && (
        <>
          <Card.Section
            className={clsx({
              "bg-gray-900": rarity === CardRarityT.BASIC,
              "bg-gray-600": rarity === CardRarityT.COMMON,
              "bg-gray-300": rarity === CardRarityT.UNCOMMON,
              "bg-indigo-500": rarity === CardRarityT.RARE,
            })}
            px="sm"
          >
            <Text size="sm">
              {rarity} {type}
            </Text>
          </Card.Section>
          <Stack align="center" gap="0" h="100%" justify="center">
            {effects.map((effect, index) => (
              <Text
                key={index}
                className={
                  effect.description.isKeyword ? "text-purple-300" : ""
                }
                fw={500}
                p="lg"
                size={size}
              >
                {effect.description.text}
              </Text>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
};
