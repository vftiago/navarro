import { Flex } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { GamePhase } from "../gameReducer";

export const StatusRow = ({
  currentPhase,
  securityLevel,
}: {
  currentPhase: GamePhase;
  securityLevel: number;
}) => {
  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl" justify="space-between">
      <Flex align="center" gap="xs">
        Server security level
        {Array.from({ length: securityLevel }).map((_, index) => (
          <TbCloudLock key={index} size="24px" />
        ))}
      </Flex>
      <Flex align="center" gap="sm">
        Current Phase: {currentPhase}
      </Flex>
    </Flex>
  );
};
