import { Container, Flex, Modal, Stack, Text } from "@mantine/core";
import { CardFront } from "./CardFront";
import { GameState } from "./gameReducer";

export const Modals = ({
  gameState,
  isCardDisplayModalOpen,
  isDeckModalOpen,
  isDiscardModalOpen,
  isTrashModalOpen,
  closeCardDisplayModal,
  closeDeckModal,
  closeDiscardModal,
  closeTrashModal,
}: {
  gameState: GameState;
  isCardDisplayModalOpen: boolean;
  isDeckModalOpen: boolean;
  isDiscardModalOpen: boolean;
  isTrashModalOpen: boolean;
  closeCardDisplayModal: () => void;
  closeDeckModal: () => void;
  closeDiscardModal: () => void;
  closeTrashModal: () => void;
}) => {
  return (
    <>
      <Modal
        opened={isCardDisplayModalOpen}
        padding={0}
        size="auto"
        withCloseButton={false}
        onClose={closeCardDisplayModal}
      >
        <Stack align="center" gap={32}>
          {gameState.fetchedCards?.map((card, index) => {
            return <CardFront key={index} card={card} size="lg" />;
          })}
        </Stack>
      </Modal>
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
    </>
  );
};
