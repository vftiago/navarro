import { Flex } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../store/gameStore";

export const StatusRow = () => {
  const { serverSecurityLevel, turnCurrentPhase, turnCurrentSubPhase } =
    useGameStore(
      useShallow((state) => ({
        serverSecurityLevel: state.serverState.serverSecurityLevel,
        turnCurrentPhase: state.turnState.turnCurrentPhase,
        turnCurrentSubPhase: state.turnState.turnCurrentSubPhase,
      })),
    );

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
