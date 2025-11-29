import { Flex, Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { useThunk } from "../state/hooks";
import { endEncounterPhase, triggerEncounterEffects } from "../state/phases";
import { useGameStore } from "../state/store";
import { TurnPhase, TurnSubPhase } from "../state/turn";
import { CardBack } from "./Card/CardBack";
import { CardFront } from "./Card/CardFront";
import { IceUnitSlot } from "./IceUnitSlot";

export const IceRow = () => {
  const {
    serverCurrentEncounteredIce,
    serverInstalledIce,
    serverMaxIceSlots,
    turnCurrentPhase,
    turnCurrentSubPhase,
  } = useGameStore(
    useShallow((state) => ({
      serverCurrentEncounteredIce:
        state.serverState.serverCurrentEncounteredIce,
      serverInstalledIce: state.serverState.serverInstalledIce,
      serverMaxIceSlots: state.serverState.serverMaxIceSlots,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
      turnCurrentSubPhase: state.turnState.turnCurrentSubPhase,
    })),
  );

  const dispatchThunk = useThunk();

  const isEncounterPhase =
    turnCurrentPhase === TurnPhase.Encounter &&
    turnCurrentSubPhase === TurnSubPhase.End;

  const handleIceClick = (iceId: string) => {
    if (
      isEncounterPhase &&
      serverCurrentEncounteredIce?.deckContextId === iceId
    ) {
      dispatchThunk(triggerEncounterEffects());
      dispatchThunk(endEncounterPhase());
    }
  };

  return (
    <Flex className="flex-row-reverse" gap="xs">
      {Array.from({ length: serverMaxIceSlots }).map((_, index) => {
        const ice = serverInstalledIce[index];
        const isBeingEncountered =
          ice &&
          serverCurrentEncounteredIce?.deckContextId === ice.deckContextId;

        return (
          <Stack
            className="bg-neutral-900 p-2.5 rounded-xl flex-col-reverse"
            gap="xs"
            key={index}
          >
            {ice ? (
              ice.isRezzed ? (
                <CardFront
                  card={ice}
                  isBeingEncountered={isBeingEncountered}
                  onClick={() => handleIceClick(ice.deckContextId)}
                />
              ) : (
                <CardBack />
              )
            ) : (
              <IceUnitSlot index={index} />
            )}
          </Stack>
        );
      })}
    </Flex>
  );
};
