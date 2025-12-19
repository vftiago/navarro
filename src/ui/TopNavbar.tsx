import { Container, Flex, Text } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";
import { RunProgressState } from "../state/turn";
import { PlayerSettings } from "./PlayerSettings";

export const TopNavbar = () => {
  const { runProgressState, turnCurrentPhase } = useGameStore(
    useShallow((state) => ({
      runProgressState: state.turnState.runProgressState,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  return (
    <div className="w-full bg-neutral-900">
      <Container fluid maw={1480} p="xs">
        <Flex align="center" justify="space-between">
          <Text size="sm">
            Current Phase: {turnCurrentPhase}
            {runProgressState !== RunProgressState.NOT_IN_RUN &&
              ` (${runProgressState})`}
          </Text>
          <PlayerSettings />
        </Flex>
      </Container>
    </div>
  );
};
