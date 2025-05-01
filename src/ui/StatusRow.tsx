import { Flex } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { useGameState } from "../context/useGameState";

export const StatusRow = () => {
  const {
    gameState: { serverState, turnState },
  } = useGameState();

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl" justify="space-between">
      <Flex align="center" gap="xs">
        Server security level
        {Array.from({ length: serverState.serverSecurityLevel }).map(
          (_, index) => (
            <TbCloudLock key={index} size="24px" />
          ),
        )}
      </Flex>
      <Flex align="center" gap="sm">
        Current Phase: {turnState.turnCurrentPhase}
      </Flex>
    </Flex>
  );
};
