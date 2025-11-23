import { Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { useGameState } from "./context/useGameState";
import { useThunk } from "./context/useThunk";
import { PhaseManager } from "./PhaseManager";
import { TurnPhase } from "./state/reducers/turnReducer";
import { getPlayerAccessedCards, getTurnCurrentPhase } from "./state/selectors";
import { endRunPhase } from "./state/thunks";
import { CorpTurn } from "./ui/CorpTurn";
import { IceRow } from "./ui/IceRow";
import { Modals } from "./ui/Modals";
import { PlayerDashboard } from "./ui/PlayerDashboard";
import { PlayerSettings } from "./ui/PlayerSettings";
import { ProgramRow } from "./ui/ProgramRow";
import { StatusRow } from "./ui/StatusRow";

export const App = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const playerAccessedCards = getPlayerAccessedCards(gameState);

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
          <PlayerSettings />
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
