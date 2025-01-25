import { Container, Flex, Modal, Stack, Text } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { GameState } from "../gameReducer";
import { motion } from "framer-motion";

export const Modals = ({
  gameState,
  isCardDisplayModalOpen,
  isDeckModalOpen,
  isDiscardModalOpen,
  isTrashModalOpen,
  isScoreModalOpen,
  closeCardDisplayModal,
  closeDeckModal,
  closeDiscardModal,
  closeTrashModal,
  closeScoreModal,
}: {
  gameState: GameState;
  isCardDisplayModalOpen: boolean;
  isDeckModalOpen: boolean;
  isDiscardModalOpen: boolean;
  isTrashModalOpen: boolean;
  isScoreModalOpen: boolean;
  closeCardDisplayModal: () => void;
  closeDeckModal: () => void;
  closeDiscardModal: () => void;
  closeTrashModal: () => void;
  closeScoreModal: () => void;
}) => {
  return (
    <>
      <Modal.Root
        opened={isCardDisplayModalOpen}
        padding={0}
        size="auto"
        onClose={closeCardDisplayModal}
      >
        <Modal.Overlay />
        <Modal.Content className="bg-transparent overflow-visible">
          <Flex gap={32}>
            {gameState.accessedCards?.map((card, index) => {
              return (
                <motion.div key={index} whileHover={{ scale: 1.1 }}>
                  <CardFront card={card} gameState={gameState} />
                </motion.div>
              );
            })}
          </Flex>
        </Modal.Content>
      </Modal.Root>
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
                return (
                  <CardFront key={index} card={card} gameState={gameState} />
                );
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
                    <CardFront card={card} gameState={gameState} />
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
      <Modal
        fullScreen
        opened={isTrashModalOpen}
        title="Trash"
        onClose={closeTrashModal}
      >
        <Container size="1360px">
          <Flex gap={32} wrap="wrap">
            {gameState.player.trash.length ? (
              gameState.player.trash.map((card, index) => {
                return (
                  <span key={index}>
                    <CardFront card={card} gameState={gameState} />
                  </span>
                );
              })
            ) : (
              <Stack align="center" justify="center" w="100%">
                <Text>Your trash pile is empty.</Text>
              </Stack>
            )}
          </Flex>
        </Container>
      </Modal>
      <Modal
        fullScreen
        opened={isScoreModalOpen}
        title="Score"
        onClose={closeScoreModal}
      >
        <Container size="1360px">
          <Flex gap={32} wrap="wrap">
            {gameState.player.score.length ? (
              gameState.player.score.map((card, index) => {
                return (
                  <span key={index}>
                    <CardFront card={card} gameState={gameState} />
                  </span>
                );
              })
            ) : (
              <Stack align="center" justify="center" w="100%">
                <Text>Your score is empty.</Text>
              </Stack>
            )}
          </Flex>
        </Container>
      </Modal>
    </>
  );
};
