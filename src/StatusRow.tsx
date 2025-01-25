import { Flex, Stack } from "@mantine/core";
import { TbClock2, TbCloudLock, TbTag } from "react-icons/tb";
import { GamePhase } from "./gameReducer";

export const StatusRow = ({
  currentPhase,
  securityLevel,
  tick,
  tags,
}: {
  currentPhase: GamePhase;
  securityLevel: number;
  tick: number;
  tags: number;
}) => {
  return (
    <Stack>
      <Flex justify="space-between">
        <Flex align="center" gap="sm">
          Server security level:
          {Array.from({ length: securityLevel }).map((_, index) => (
            <TbCloudLock key={index} size="24px" />
          ))}
        </Flex>
        <Flex align="center" gap="sm">
          Remaining ticks:
          {Array.from({ length: tick }).map((_, index) => (
            <TbClock2 key={index} size="24px" />
          ))}
        </Flex>
      </Flex>
      <Flex justify="space-between">
        <Flex align="center" gap="sm">
          Current Phase: {currentPhase}
        </Flex>
        <Flex align="center" gap="sm">
          Player Tags:
          {Array.from({ length: tags }).map((_, index) => (
            <TbTag key={index} size="24px" />
          ))}
        </Flex>
      </Flex>
    </Stack>
  );
};
