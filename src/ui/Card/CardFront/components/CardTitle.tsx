import { Flex, Text } from "@mantine/core";
import clsx from "clsx";

export const CardTitle = ({
  name,
  rootClassName,
}: {
  name: string;
  rootClassName?: string;
}) => {
  return (
    <Flex align="center" justify="center">
      <Text className={clsx(rootClassName)} fw={500} size="sm">
        {name}
      </Text>
    </Flex>
  );
};
