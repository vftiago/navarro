import { Flex, Tooltip } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";

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
      <Flex align="center" gap="sm">
        Current Phase: {turnCurrentPhase}/{turnCurrentSubPhase}
      </Flex>
      <Flex align="center" gap="xs">
        <Tooltip label="Server Security Level">
          <TbCloudLock size="24px" />
        </Tooltip>
        {serverSecurityLevel}
      </Flex>
    </Flex>
  );
};
