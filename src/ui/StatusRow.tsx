import { Flex, Tooltip } from "@mantine/core";
import { TbCloudLock } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";
import { RunProgressState } from "../state/turn";

export const StatusRow = () => {
  const { runProgressState, serverSecurityLevel, turnCurrentPhase } =
    useGameStore(
      useShallow((state) => ({
        runProgressState: state.turnState.runProgressState,
        serverSecurityLevel: state.serverState.serverSecurityLevel,
        turnCurrentPhase: state.turnState.turnCurrentPhase,
      })),
    );

  return (
    <Flex className="rounded-md bg-neutral-900 p-2.5" justify="space-between">
      <Flex align="center" gap="sm">
        Current Phase: {turnCurrentPhase}
        {runProgressState !== RunProgressState.NOT_IN_RUN &&
          ` (${runProgressState})`}
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
