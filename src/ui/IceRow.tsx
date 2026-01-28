import { Flex, Stack, Tabs } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { ServerName, setSelectedServer } from "../state/server";
import { getCardSize } from "../state/settings";
import { getGameState, useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";
import { IceUnitSlot } from "./IceUnitSlot";

const ALL_SERVERS = [ServerName.HQ, ServerName.RD, ServerName.ARCHIVES];

export const IceRow = () => {
  const {
    dispatch,
    runProgressState,
    selectedServer,
    serverCurrentEncounteredIce,
    serverMaxIceSlots,
    servers,
    turnCurrentPhase,
  } = useGameStore(
    useShallow((state) => ({
      dispatch: state.dispatch,
      runProgressState: state.turnState.runProgressState,
      selectedServer: state.serverState.selectedServer,
      serverCurrentEncounteredIce:
        state.serverState.serverCurrentEncounteredIce,
      serverMaxIceSlots: state.serverState.serverMaxIceSlots,
      servers: state.serverState.servers,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  const eventBus = useEventBus();
  const cardSize = getCardSize(getGameState());

  const isEncounterActive =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ENCOUNTERING_ICE;

  const isRunning = turnCurrentPhase === TurnPhase.Run;

  const handleIceClick = (iceId: string) => {
    if (
      isEncounterActive &&
      serverCurrentEncounteredIce?.deckContextId === iceId
    ) {
      eventBus.emit({
        payload: { iceId },
        type: GameEventType.PLAYER_CLICK_ICE,
      });
    }
  };

  const handleTabChange = (value: string | null) => {
    if (isRunning || !value) return;
    dispatch(setSelectedServer(value as ServerName));
  };

  return (
    <Tabs className="w-full" value={selectedServer} onChange={handleTabChange}>
      <Tabs.List>
        {ALL_SERVERS.map((server) => (
          <Tabs.Tab
            className="font-orbitron font-bold disabled:opacity-50"
            disabled={isRunning}
            key={server}
            value={server}
          >
            {server}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {ALL_SERVERS.map((server) => {
        const serverIce = servers[server].installedIce;

        return (
          <Tabs.Panel key={server} pt="md" value={server}>
            <Flex className="flex-row-reverse" gap="xs">
              <Stack
                className="flex-col-reverse rounded-md bg-neutral-900"
                gap="xs"
              >
                <Stack
                  className="font-orbitron h-full items-center justify-center font-bold"
                  {...cardSize}
                >
                  {server}
                </Stack>
              </Stack>
              {Array.from({ length: serverMaxIceSlots }).map((_, index) => {
                const ice = serverIce[index];
                const isBeingEncountered =
                  ice &&
                  serverCurrentEncounteredIce?.deckContextId ===
                    ice.deckContextId;

                return (
                  <Stack
                    className="flex-col-reverse rounded-md bg-neutral-900"
                    gap="xs"
                    key={index}
                  >
                    {ice ? (
                      <CardFront
                        card={ice}
                        isBeingEncountered={isBeingEncountered}
                        onClick={() => handleIceClick(ice.deckContextId)}
                      />
                    ) : (
                      <IceUnitSlot index={index} />
                    )}
                  </Stack>
                );
              })}
            </Flex>
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};
