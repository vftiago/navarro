import { Container, Stack } from "@mantine/core";
import { useCallback, useEffect } from "react";
import { IceRow } from "./ui/IceRow";
import { useDisclosure } from "@mantine/hooks";
import { StatusRow } from "./ui/StatusRow";
import { Modals } from "./ui/Modals";

import { PlayerDashboard } from "./ui/PlayerDashboard";
import { useGameState } from "./context/useGameState";
import { ProgramRow } from "./ui/ProgramRow";
import { CorpTurn } from "./ui/CorpTurn";
import { TurnPhase } from "./state/reducers/turnReducer";
import { PhaseManager } from "./PhaseManager";
import { useThunk } from "./context/useThunk";
import { endRunPhase } from "./state/thunks";
import { getPlayerAccessedCards, getTurnCurrentPhase } from "./state/selectors";
import { ServerRow } from "./ui/ServerRow";

export const App = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const playerAccessedCards = getPlayerAccessedCards(gameState);

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
    if (playerAccessedCards.length > 0) {
      openCardDisplayModal();
    }
  }, [playerAccessedCards, openCardDisplayModal]);

  const onCloseDisplayCardModal = useCallback(() => {
    closeCardDisplayModal();
    dispatchThunk(endRunPhase());
  }, [closeCardDisplayModal, dispatchThunk]);

  return (
    <div className="overflow-hidden">
      <PhaseManager />
      {turnCurrentPhase === TurnPhase.Corp ? <CorpTurn /> : null}
      <Container fluid maw={1620} p="lg">
        <Modals
          closeCardDisplayModal={onCloseDisplayCardModal}
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
          <ServerRow />
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
