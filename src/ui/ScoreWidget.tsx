import { Badge, Flex, Text } from "@mantine/core";

export const ScoreWidget = ({ victoryPoints }: { victoryPoints: number }) => {
  return (
    <Flex align="center" justify="end">
      <Badge h="4rem" size="xl" variant="gradient" w="4rem">
        <Text fw="bold" size="2rem">
          {victoryPoints}
        </Text>
      </Badge>
    </Flex>
  );
};
