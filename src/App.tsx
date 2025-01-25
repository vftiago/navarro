import {
  Button,
  Container,
  Flex,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useReducer } from "react";
import { ServerRow } from "./ServerRow";
import { PlayingCardT } from "./cards/cards";
import { PlayerHand } from "./PlayerHand";
import { useDisclosure } from "@mantine/hooks";
import { gameReducer, initialGameState } from "./gameReducer";
import { CardFront } from "./CardFront";
import { TbClock2, TbCloudLock } from "react-icons/tb";
import { useGameState } from "./useGameState";

export const App = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const [isDeckModalOpen, { open: openDeckModal, close: closeDeckModal }] =
    useDisclosure(false);

  const [
    isDiscardModalOpen,
    { open: openDiscardModal, close: closeDiscardModal },
  ] = useDisclosure(false);

  const {
    isNewTurn,
    setIsNewTurn,
    currentTurn,
    setCurrentTurn,
    currentTick,
    setCurrentTick,
    currentPlayerCards,
    setCurrentPlayerCards,
  } = useGameState({
    turn: gameState.turn,
    tick: gameState.tick,
    hand: gameState.player.hand,
  });

  useEffect(() => {
    setIsNewTurn(true);
  }, [gameState.turn, setIsNewTurn]);

  useEffect(() => {
    if (currentTurn !== gameState.turn) {
      setCurrentTurn(gameState.turn);
    }
  }, [currentTurn, gameState.turn, setCurrentTurn]);

  useEffect(() => {
    if (currentTick !== gameState.tick) {
      setCurrentTick(gameState.tick);
    }
  }, [currentTick, gameState.tick, setCurrentTick]);

  useEffect(() => {
    setCurrentPlayerCards(gameState.player.hand);
  }, [gameState.player.hand, setCurrentPlayerCards]);

  const onClickPlayerCard = (card: PlayingCardT, index: number) => {
    dispatch({ type: "playCard", card, index });
    setIsNewTurn(false);
  };

  const onClickEndTurn = useCallback(() => {
    dispatch({ type: "endTurn" });
  }, []);

  return (
    <Container fluid className="overflow-hidden" h="100%" maw={1600} p="xs">
      <Modal
        fullScreen
        opened={isDeckModalOpen}
        title="Deck"
        onClose={closeDeckModal}
      >
        <Container size="1360px">
          <Flex gap={32} wrap="wrap">
            {gameState.player.currentDeck.length ? (
              gameState.player.currentDeck.map((card, index) => {
                return <CardFront key={index} card={card} />;
              })
            ) : (
              <Stack align="center" h="400px" justify="center" w="100%">
                <Text>Your deck is empty.</Text>
              </Stack>
            )}
          </Flex>
        </Container>
      </Modal>
      <Modal
        fullScreen
        opened={isDiscardModalOpen}
        title="Discard"
        onClose={closeDiscardModal}
      >
        <Container size="1360px">
          <Flex gap={32} wrap="wrap">
            {gameState.player.discard.length ? (
              gameState.player.discard.map((card, index) => {
                return (
                  <span key={index}>
                    <CardFront card={card} />
                  </span>
                );
              })
            ) : (
              <Stack align="center" justify="center" w="100%">
                <Text>Your discard pile is empty.</Text>
              </Stack>
            )}
          </Flex>
        </Container>
      </Modal>
      <Stack content="space-between" h="100%" justify="space-between">
        <Stack>
          <Stack>
            <Title order={2}>Server</Title>
            <Flex justify="space-between" w="100%">
              <ServerRow serverCards={gameState.server.currentDeck} />
            </Flex>
            <Flex align="center" gap="sm">
              Server security level:
              {Array.from({ length: gameState.securityLevel }).map(
                (_, index) => (
                  <TbCloudLock key={index} size="24px" />
                ),
              )}
            </Flex>
            <Flex align="center" gap="sm">
              Remaining ticks:
              {Array.from({ length: gameState.tick }).map((_, index) => (
                <TbClock2 key={index} size="24px" />
              ))}
            </Flex>
          </Stack>
        </Stack>
        <Flex className="justify-between">
          <Stack className="flex-col-reverse">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({gameState.player.currentDeck.length})
            </Button>
          </Stack>
          <PlayerHand
            key={`${currentTurn}-${currentTick}`}
            isNewTurn={isNewTurn}
            playerCards={currentPlayerCards}
            onClick={onClickPlayerCard}
          />
          <Stack className="flex-col-reverse">
            <Button size="xl" variant="gradient" onClick={onClickEndTurn}>
              End turn ({gameState.turn})
            </Button>
            <Button size="lg" variant="gradient" onClick={openDiscardModal}>
              Discard ({gameState.player.discard.length})
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};

export default App;
