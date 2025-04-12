import { Container, Stack } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { IceRow } from "./ui/IceRow";
import { useDisclosure } from "@mantine/hooks";
import { GamePhase } from "./gameReducer";
import { StatusRow } from "./ui/StatusRow";
import { EXIT_ANIMATION_DURATION } from "./ui/constants";
import { Modals } from "./ui/Modals";
import { delay } from "framer-motion";

import { PlayerDashboard } from "./ui/PlayerDashboard";
import { useGameState } from "./context/useGameState";
import { ProgramRow } from "./ui/ProgramRow";
import { CorpTurn } from "./ui/CorpTurn";

export const App = () => {
  const currentAnimationKey = useRef(0);

  const {
    gameState: {
      animationKey,
      accessedCards,
      currentPhase,
      nextAction,
      shouldWaitForPlayerInput,
    },
    dispatch,
  } = useGameState();

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
    if (animationKey !== currentAnimationKey.current) {
      currentAnimationKey.current = animationKey;
    }
  }, [animationKey]);

  useEffect(() => {
    if (accessedCards.length > 0) {
      openCardDisplayModal();
    }
  }, [accessedCards, openCardDisplayModal]);

  const onCloseDisplayCardModal = useCallback(() => {
    closeCardDisplayModal();

    delay(() => {
      if (nextAction) {
        dispatch(nextAction);
      }
    }, EXIT_ANIMATION_DURATION);
  }, [closeCardDisplayModal, nextAction, dispatch]);

  useEffect(() => {
    if (shouldWaitForPlayerInput || !nextAction) {
      return;
    }

    delay(() => {
      if (nextAction) {
        dispatch(nextAction);
      }
    }, EXIT_ANIMATION_DURATION);
  }, [nextAction, dispatch, shouldWaitForPlayerInput]);

  return (
    <div className="overflow-hidden">
      {currentPhase === GamePhase.Corp ? <CorpTurn /> : null}
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
