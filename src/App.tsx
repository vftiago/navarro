import { Button, Container, Flex, Stack, Title } from "@mantine/core";
import { useCallback, useEffect, useReducer } from "react";
import { ServerRow } from "./ServerRow";
import { CardKeywordT, PlayingCardT } from "./cards/cards";
import { PlayerHand } from "./PlayerHand";
import { useDisclosure } from "@mantine/hooks";
import { GamePhase, gameReducer, initialGameState } from "./gameReducer";
import { StatusRow } from "./StatusRow";
import { EXIT_ANIMATION_DURATION } from "./constants";
import { Modals } from "./Modals";
import { delay } from "framer-motion";

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

  useEffect(() => {
    if (gameState.fetchedCards.length > 0) {
      openCardDisplayModal();
    }
  }, [gameState.fetchedCards, openCardDisplayModal]);

  const onClickPlayerCard = useCallback(
    (card: PlayingCardT, index: number) => {
      if (
        gameState.currentPhase !== GamePhase.Main ||
        card.keywords?.includes(CardKeywordT.UNPLAYABLE)
      ) {
        return;
      }

      delay(() => {
        // i think we should set a transition phase here, which should take as long as EXIT_ANIMATION_DURATION, and then switch to the next phase. All player input should be disabled during this transition phase.
        dispatch({ type: "mainPhase", card, index });
      }, EXIT_ANIMATION_DURATION);
    },
    [gameState.currentPhase],
  );

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
    if (gameState.tick === 0 && gameState.currentPhase === GamePhase.Main) {
      dispatch({ type: "discardPhase" });
    }
  }, [gameState.tick, gameState.currentPhase]);

  return (
    <Container fluid className="overflow-hidden" h="100%" maw={1600} p="xs">
      <Modals
        closeCardDisplayModal={closeCardDisplayModal}
        closeDeckModal={closeDeckModal}
        closeDiscardModal={closeDiscardModal}
        closeTrashModal={closeTrashModal}
        gameState={gameState}
        isCardDisplayModalOpen={isCardDisplayModalOpen}
        isDeckModalOpen={isDeckModalOpen}
        isDiscardModalOpen={isDiscardModalOpen}
        isTrashModalOpen={isTrashModalOpen}
      />
      <Stack content="space-between" h="100%" justify="space-between">
        <Stack>
          <Stack>
            <Title order={2}>Server</Title>
            <Flex justify="space-between" w="100%">
              <ServerRow serverCards={gameState.server.currentDeck} />
            </Flex>
            <StatusRow
              currentPhase={gameState.currentPhase}
              securityLevel={gameState.securityLevel}
              tags={gameState.player.tags}
              tick={gameState.tick}
            />
          </Stack>
        </Stack>
        <Flex className="justify-between">
          <Stack className="flex-col-reverse">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({gameState.player.currentDeck.length})
            </Button>
          </Stack>

          {gameState.currentPhase === GamePhase.Main &&
          gameState.player.hand.length === 0 ? (
            <div>Your hand is empty.</div>
          ) : (
            <PlayerHand
              animationKey={gameState.animationKey}
              playerCards={gameState.player.hand}
              onClick={onClickPlayerCard}
            />
          )}

          <Stack className="flex-col-reverse">
            <Button size="xl" variant="gradient" onClick={onClickEndTurn}>
              End turn ({gameState.turn})
            </Button>
            <Button size="md" variant="gradient" onClick={openDiscardModal}>
              Discard ({gameState.player.discard.length})
            </Button>
            <Button size="md" variant="gradient" onClick={openTrashModal}>
              Trash ({gameState.player.trash.length})
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};

export default App;
