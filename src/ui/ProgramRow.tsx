import { Flex, Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { CardType } from "../cards/enums";
import { resolveCard } from "../cards/instance";
import { GameEventType, useEventBus } from "../state/events";
import { useGameStore } from "../state/store";
import { TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";

export const ProgramRow = () => {
  const {
    playerInstalledPrograms,
    playerMemory,
    turnCurrentPhase,
    turnRemainingClicks,
  } = useGameStore(
    useShallow((state) => ({
      playerInstalledPrograms: state.playerState.playerInstalledPrograms,
      playerMemory: state.playerState.playerMemory,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
      turnRemainingClicks: state.turnState.turnRemainingClicks,
    })),
  );

  const eventBus = useEventBus();

  const handleProgramClick = (instanceId: string) => {
    const program = playerInstalledPrograms.find(
      (installed) => installed.instanceId === instanceId,
    );

    if (!program) {
      return;
    }

    // UX gating only — the event handler is the authority on click rules
    const definition = resolveCard(program);
    const ability =
      definition.type === CardType.PROGRAM
        ? definition.abilities?.[0]
        : undefined;

    if (
      !ability ||
      turnCurrentPhase !== TurnPhase.Main ||
      (ability.cost.clicks ?? 0) > turnRemainingClicks
    ) {
      return;
    }

    eventBus.emit({
      payload: { instanceId },
      type: GameEventType.CARD_CLICKED,
    });
  };

  return (
    <Flex gap="xs">
      {Array.from({ length: playerMemory }).map((_, index) => {
        const program = playerInstalledPrograms.at(index);

        return (
          <Stack className="rounded-md bg-neutral-900" gap="xs" key={index}>
            {program ? (
              <CardFront
                card={program}
                onClick={() => {
                  handleProgramClick(program.instanceId);
                }}
              />
            ) : null}
          </Stack>
        );
      })}
    </Flex>
  );
};
