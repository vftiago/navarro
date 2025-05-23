import { Container, Flex, Modal, Stack, Text } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { motion } from "framer-motion";
import { useGameState } from "../context/useGameState";

export const Modals = ({
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
  const {
    gameState: { playerState },
  } = useGameState();

  const {
    playerAccessedCards,
    playerDeck,
    playerDiscardPile,
    playerTrashPile,
    playerScoreArea,
  } = playerState;

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
            {playerAccessedCards?.map((card, index) => {
              return (
                <motion.div key={index} whileHover={{ scale: 1.1 }}>
                  <CardFront card={card} />
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
            {playerDeck.length ? (
              playerDeck.map((card, index) => {
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
            {playerDiscardPile.length ? (
              playerDiscardPile.map((card, index) => {
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
      <Modal
        fullScreen
        opened={isTrashModalOpen}
        title="Trash"
        onClose={closeTrashModal}
      >
        <Container size="1360px">
          <Flex gap={32} wrap="wrap">
            {playerTrashPile.length ? (
              playerTrashPile.map((card, index) => {
                return (
                  <span key={index}>
                    <CardFront card={card} />
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
            {playerScoreArea.length ? (
              playerScoreArea.map((card, index) => {
                return (
                  <span key={index}>
                    <CardFront card={card} />
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
