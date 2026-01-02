import { Container, Stack } from "@mantine/core";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { PhaseManager } from "./PhaseManager";
import {
  createEventBus,
  createEventHandler,
  EventBusContext,
} from "./state/events";
import { getGameState, useGameStore } from "./state/store";
import { TurnPhase } from "./state/turn";
import { AccessedCardsOverlay } from "./ui/AccessedCardsOverlay";
import { CorpTurn } from "./ui/CorpTurn";
import { IceRow } from "./ui/IceRow";
import { type ModalType, Modals } from "./ui/Modals";
import { PlayerDashboard } from "./ui/PlayerDashboard";
import { ProgramRow } from "./ui/ProgramRow";
import { StatusRow } from "./ui/StatusRow";
import { TopNavbar } from "./ui/TopNavbar";

export const Game = () => {
  const { dispatch, turnCurrentPhase } = useGameStore(
    useShallow((state) => ({
      dispatch: state.dispatch,
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

  const [openModal, setOpenModal] = useState<ModalType>(null);
  const closeModal = useCallback(() => setOpenModal(null), []);

  return (
    <EventBusContext.Provider value={eventBus}>
      <PhaseManager />
      <AnimatePresence>
        {turnCurrentPhase === TurnPhase.Corp ? <CorpTurn /> : null}
      </AnimatePresence>
      <TopNavbar />
      <Container fluid maw={1480} p="xs">
        <Stack className="h-full" gap="xs">
          <IceRow />
          <StatusRow />
          <ProgramRow />
          <PlayerDashboard setOpenModal={setOpenModal} />
        </Stack>
        <Modals closeModal={closeModal} openModal={openModal} />
      </Container>
      <AccessedCardsOverlay />
    </EventBusContext.Provider>
  );
};
