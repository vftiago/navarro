import { Button, Container, Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useReducer } from "react";
import { IceRow } from "./ui/IceRow";
import { PlayingCardT } from "./cards/card";
import { PlayerHand } from "./ui/PlayerHand";
import { useDisclosure } from "@mantine/hooks";
import { GamePhase, gameReducer, initialGameState } from "./gameReducer";
import { StatusRow } from "./ui/StatusRow";
import { EXIT_ANIMATION_DURATION } from "./ui/constants";
import { Modals } from "./ui/Modals";
import { delay } from "framer-motion";
import { ClickWidget } from "./ui/ClickWidget";
import { TagWidget } from "./ui/TagWidget";

export const App = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

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
    if (gameState.fetchedCards.length > 0) {
      openCardDisplayModal();
    }
  }, [gameState.fetchedCards, openCardDisplayModal]);

  const onClickPlayerCard = useCallback((card: PlayingCardT, index: number) => {
    delay(() => {
      // i think we should set a transition phase here, which should take as long as EXIT_ANIMATION_DURATION, and then switch to the next phase. All player input should be disabled during this transition phase.
      dispatch({ type: "mainPhase", card, index });
    }, EXIT_ANIMATION_DURATION);
  }, []);

  const onClickEndTurn = useCallback(() => {
    if (gameState.currentPhase !== GamePhase.Main) {
      return;
    }

    dispatch({ type: "discardPhase" });
  }, [gameState.currentPhase]);

  useEffect(() => {
    switch (gameState.currentPhase) {
      case GamePhase.Discard:
        delay(() => {
          dispatch({ type: "endPhase" });
        }, EXIT_ANIMATION_DURATION * gameState.player.hand.length);
        break;

      case GamePhase.End:
        delay(() => {
          dispatch({ type: "drawPhase" });
        }, EXIT_ANIMATION_DURATION * gameState.player.hand.length);
        break;

      case GamePhase.Draw:
        delay(() => {
          dispatch({ type: "mainPhase" });
        }, EXIT_ANIMATION_DURATION * gameState.player.hand.length);

        break;
    }
  }, [gameState.currentPhase, gameState.player.hand.length]);

  useEffect(() => {
    if (gameState.shouldDiscard) {
      dispatch({ type: "discardPhase" });
    }
  }, [gameState.shouldDiscard]);

  return (
    <Container fluid className="overflow-hidden h-full" maw={1620} p="lg">
      <Modals
        closeCardDisplayModal={closeCardDisplayModal}
        closeDeckModal={closeDeckModal}
        closeDiscardModal={closeDiscardModal}
        closeScoreModal={closeScoreModal}
        closeTrashModal={closeTrashModal}
        gameState={gameState}
        isCardDisplayModalOpen={isCardDisplayModalOpen}
        isDeckModalOpen={isDeckModalOpen}
        isDiscardModalOpen={isDiscardModalOpen}
        isScoreModalOpen={isScoreModalOpen}
        isTrashModalOpen={isTrashModalOpen}
      />
      <Stack content="space-between" h="100%" justify="space-between">
        <Stack gap="xs">
          <IceRow gameState={gameState} />
          <StatusRow
            currentPhase={gameState.currentPhase}
            securityLevel={gameState.securityLevel}
          />
        </Stack>

        <Flex className="justify-between">
          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({gameState.player.currentDeck.length})
            </Button>
            <ClickWidget remainingClicks={gameState.tick} />
            <TagWidget tagCount={gameState.player.tags} />
          </Stack>

          {gameState.currentPhase === GamePhase.Main &&
          gameState.player.hand.length === 0 ? (
            <div>Your hand is empty.</div>
          ) : (
            <PlayerHand
              animationKey={gameState.animationKey}
              gameState={gameState}
              playerCards={gameState.player.hand}
              onClick={onClickPlayerCard}
            />
          )}

          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={onClickEndTurn}>
              End turn ({gameState.turn})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openDiscardModal}
            >
              Discard ({gameState.player.discard.length})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openTrashModal}
            >
              Trash ({gameState.player.trash.length})
            </Button>
            <Button
              className="self-end"
              color="yellow"
              size="sm"
              w="8rem"
              onClick={openScoreModal}
            >
              Score ({gameState.player.victoryPoints})
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};

export default App;
