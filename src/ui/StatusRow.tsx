import { Flex } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { useGameState } from "../context/useGameState";
import {
  getServerSecurityLevel,
  getTurnCurrentPhase,
  getTurnCurrentSubPhase,
} from "../state/selectors";

export const StatusRow = () => {
  const { gameState } = useGameState();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const turnCurrentSubPhase = getTurnCurrentSubPhase(gameState);
  const serverSecurityLevel = getServerSecurityLevel(gameState);

  return (
    <Flex className="bg-neutral-900 p-2.5 rounded-xl" justify="space-between">
      <Flex align="center" gap="xs">
        Server security level
        {Array.from({ length: serverSecurityLevel }).map((_, index) => (
          <TbCloudLock key={index} size="24px" />
        ))}
      </Flex>
      <Flex align="center" gap="sm">
        Current Phase: {turnCurrentPhase}/{turnCurrentSubPhase}
      </Flex>
    </Flex>
  );
};
