import { Flex, Text } from "@mantine/core";
import clsx from "clsx";
import { CardRarity } from "../../../../cardDefinitions/card";

export const CardTypeLine = ({
  rarity,
  type,
  subtype,
  size = "xs",
}: {
  rarity: CardRarity;
  type: string;
  subtype?: string;
  size?: "xs" | "sm" | "md";
}) => {
  return (
    <Flex
      className={clsx({
        "bg-gray-900": rarity === CardRarity.BASIC,
        "bg-gray-600": rarity === CardRarity.COMMON,
        "bg-cyan-600": rarity === CardRarity.UNCOMMON,
        "bg-indigo-500": rarity === CardRarity.RARE,
      })}
      px={size}
    >
      <Text size={size}>
        {type}
        {subtype ? ` — ${subtype}` : null}
      </Text>
    </Flex>
  );
};
