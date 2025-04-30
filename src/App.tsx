import { Container, Stack } from "@mantine/core";
import { useCallback, useEffect } from "react";
import { IceRow } from "./ui/IceRow";
import { useDisclosure } from "@mantine/hooks";
import { StatusRow } from "./ui/StatusRow";
import { EXIT_ANIMATION_DURATION } from "./ui/constants";
import { Modals } from "./ui/Modals";
import { delay } from "framer-motion";

import { PlayerDashboard } from "./ui/PlayerDashboard";
import { useGameState } from "./context/useGameState";
import { ProgramRow } from "./ui/ProgramRow";
import { CorpTurn } from "./ui/CorpTurn";
import { useThunk } from "./context/useThunk";
import { getAccessedCards, getTurnCurrentPhase } from "./state/selectors";
import { onCloseDisplayCardModal } from "./state/thunks";
import { GamePhase } from "./state/types";
import { PhaseManager } from "./PhaseManager";

export const App = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const accessedCards = getAccessedCards(gameState);

  const [isDeckModalOpen, { open: openDeckModal, close: closeDeckModal }] =
    useDisclosure(false);

  const [
    isDiscardModalOpen,
    { open: openDiscardModal, close: closeDiscardModal },
  ] = useDisclosure(false);

  const [
    isCardDisplayModalOpen,
    { open: openCardDisplayModal, close: closeCardDisplayModal },
  ] = useDisclosure(false);

  const [isTrashModalOpen, { open: openTrashModal, close: closeTrashModal }] =
    useDisclosure(false);

  const [isScoreModalOpen, { open: openScoreModal, close: closeScoreModal }] =
    useDisclosure(false);

  useEffect(() => {
    if (accessedCards.length > 0) {
      openCardDisplayModal();
    }
  }, [accessedCards, openCardDisplayModal]);

  const handleCloseDisplayCardModal = useCallback(() => {
    closeCardDisplayModal();

    delay(() => {
      dispatchThunk(onCloseDisplayCardModal());
    }, EXIT_ANIMATION_DURATION);
  }, [closeCardDisplayModal, dispatchThunk]);
  return (
    <div className="overflow-hidden">
      <PhaseManager />
      {turnCurrentPhase === GamePhase.Corp ? <CorpTurn /> : null}
      <Container fluid maw={1620} p="lg">
        <Modals
          closeCardDisplayModal={handleCloseDisplayCardModal}
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
        <Stack gap="xs">
          <IceRow />
          <StatusRow />
          <ProgramRow />
        </Stack>
      </Container>
      <PlayerDashboard
        openDeckModal={openDeckModal}
        openDiscardModal={openDiscardModal}
        openScoreModal={openScoreModal}
        openTrashModal={openTrashModal}
      />
    </div>
  );
};

export default App;
