import { Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { PhaseManager } from "./PhaseManager";
import {
  createEventBus,
  createEventHandler,
  EventBusContext,
} from "./state/events";
import { getGameState, useGameStore } from "./state/store";
import { RunProgressState, TurnPhase } from "./state/turn";
import { CorpTurn } from "./ui/CorpTurn";
import { IceRow } from "./ui/IceRow";
import { Modals } from "./ui/Modals";
import { PlayerDashboard } from "./ui/PlayerDashboard";
import { PlayerSettings } from "./ui/PlayerSettings";
import { ProgramRow } from "./ui/ProgramRow";
import { StatusRow } from "./ui/StatusRow";

export const App = () => {
  const { dispatch, playerAccessedCards, runProgressState, turnCurrentPhase } =
    useGameStore(
      useShallow((state) => ({
        dispatch: state.dispatch,
        playerAccessedCards: state.playerState.playerAccessedCards,
        runProgressState: state.turnState.runProgressState,
        turnCurrentPhase: state.turnState.turnCurrentPhase,
      })),
    );

  // Create event bus (only once)
  const eventBus = useMemo(() => createEventBus(), []);

  // Create event handler (only once - it uses getGameState internally to get fresh state)
  const eventHandler = useMemo(
    () => createEventHandler(dispatch, getGameState),
    [dispatch],
  );

  // Subscribe event handler to event bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(eventHandler);

    // Log event bus creation in dev mode
    if (import.meta.env.DEV) {
      console.log("[EventBus] Initialized and subscribed to event handler");
    }

    return unsubscribe;
  }, [eventBus, eventHandler]);

  const [isDeckModalOpen, { close: closeDeckModal, open: openDeckModal }] =
    useDisclosure(false);

  const [
    isDiscardModalOpen,
    { close: closeDiscardModal, open: openDiscardModal },
  ] = useDisclosure(false);

  const [
    isCardDisplayModalOpen,
    { close: closeCardDisplayModal, open: openCardDisplayModal },
  ] = useDisclosure(false);

  const [isTrashModalOpen, { close: closeTrashModal, open: openTrashModal }] =
    useDisclosure(false);

  const [isScoreModalOpen, { close: closeScoreModal, open: openScoreModal }] =
    useDisclosure(false);

  useEffect(() => {
    if (
      turnCurrentPhase === TurnPhase.Run &&
      runProgressState === RunProgressState.ACCESSING_CARDS &&
      playerAccessedCards.length > 0
    ) {
      openCardDisplayModal();
    }
  }, [
    turnCurrentPhase,
    runProgressState,
    playerAccessedCards,
    openCardDisplayModal,
  ]);

  return (
    <EventBusContext.Provider value={eventBus}>
      <PhaseManager />
      <AnimatePresence>
        {turnCurrentPhase === TurnPhase.Corp ? <CorpTurn /> : null}
      </AnimatePresence>
      <Container fluid maw={1480} p="xs">
        <Stack className="h-full" gap="xs">
          <PlayerSettings />
          <IceRow />
          <StatusRow />
          <ProgramRow />
          <PlayerDashboard
            openDeckModal={openDeckModal}
            openDiscardModal={openDiscardModal}
            openScoreModal={openScoreModal}
            openTrashModal={openTrashModal}
          />
        </Stack>
        <Modals
          closeCardDisplayModal={closeCardDisplayModal}
          closeDeckModal={closeDeckModal}
          closeDiscardModal={closeDiscardModal}
          closeScoreModal={closeScoreModal}
          closeTrashModal={closeTrashModal}
          isCardDisplayModalOpen={isCardDisplayModalOpen}
          isDeckModalOpen={isDeckModalOpen}
          isDiscardModalOpen={isDiscardModalOpen}
          isScoreModalOpen={isScoreModalOpen}
          isTrashModalOpen={isTrashModalOpen}
        />
      </Container>
    </EventBusContext.Provider>
  );
};

export default App;
