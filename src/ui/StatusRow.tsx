import { Flex, Tooltip } from "@mantine/core";
import { AiOutlineSound } from "react-icons/ai";
import { BiSignal5 } from "react-icons/bi";
import { TbCloudLock, TbWaveSine } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";

export const StatusRow = () => {
  const { playerNoise, playerSignal, serverSecurityLevel } = useGameStore(
    useShallow((state) => ({
      playerNoise: state.playerState.playerNoise,
      playerSignal: state.playerState.playerSignal,
      serverSecurityLevel: state.serverState.serverSecurityLevel,
    })),
  );

  return (
    <Flex className="rounded-md bg-neutral-900 p-2.5" justify="space-between">
      <Flex align="center" className="w-full" gap="md">
        <Flex align="center" gap="xs">
          <Tooltip label="Signal">
            <TbWaveSine size="24px" />
          </Tooltip>
          {playerSignal}
        </Flex>
        <Flex align="center" gap="xs">
          <Tooltip label="Noise">
            <AiOutlineSound size="24px" />
          </Tooltip>
          {playerNoise}
        </Flex>
      </Flex>
      <Flex align="center" className="w-full" gap="xs" justify="center">
        <Tooltip label="Signal to Noise Ratio">
          <BiSignal5 size="24px" />
        </Tooltip>
        {playerSignal - playerNoise}
      </Flex>
      <Flex align="center" className="w-full" gap="xs" justify="right">
        <Tooltip label="Server Security Level">
          <TbCloudLock size="24px" />
        </Tooltip>
        {serverSecurityLevel}
      </Flex>
    </Flex>
  );
};
