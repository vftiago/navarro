import { Container, Flex, Text, Tooltip } from "@mantine/core";
import type { ReactNode } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { BiSignal5 } from "react-icons/bi";
import { TbCloudLock, TbWaveSine } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";
import { RunProgressState } from "../state/turn";
import { PlayerSettings } from "./PlayerSettings";

const Indicator = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) => (
  <Flex align="center" gap="xs">
    <Tooltip label={label}>
      <span className="flex">{icon}</span>
    </Tooltip>
    <Text size="sm">{value}</Text>
  </Flex>
);

export const TopNavbar = () => {
  const {
    playerNoise,
    playerSignal,
    runProgressState,
    serverSecurityLevel,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      playerNoise: state.playerState.playerNoise,
      playerSignal: state.playerState.playerSignal,
      runProgressState: state.turnState.runProgressState,
      serverSecurityLevel: state.serverState.serverSecurityLevel,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  return (
    <div className="w-full bg-neutral-900">
      <Container fluid maw={1480} p="xs">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="lg">
            <Text size="sm">
              Current Phase: {turnCurrentPhase}
              {runProgressState !== RunProgressState.NOT_IN_RUN &&
                ` (${runProgressState})`}
            </Text>
            <Indicator
              icon={<TbWaveSine size="24px" />}
              label="Signal"
              value={playerSignal}
            />
            <Indicator
              icon={<AiOutlineSound size="24px" />}
              label="Noise"
              value={playerNoise}
            />
            <Indicator
              icon={<BiSignal5 size="24px" />}
              label="Signal to Noise Ratio"
              value={playerSignal - playerNoise}
            />
            <Indicator
              icon={<TbCloudLock size="24px" />}
              label="Server Security Level"
              value={serverSecurityLevel}
            />
          </Flex>
          <PlayerSettings />
        </Flex>
      </Container>
    </div>
  );
};
