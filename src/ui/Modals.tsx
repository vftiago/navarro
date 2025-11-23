import { Flex, Modal } from "@mantine/core";
import { CardFront } from "./Card/CardFront";
import { CardGridModal } from "./CardGridModal";
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
      <CardGridModal
        cards={playerDeck}
        emptyMessage="Your deck is empty."
        opened={isDeckModalOpen}
        title="Deck"
        onClose={closeDeckModal}
      />
      <CardGridModal
        cards={playerDiscardPile}
        emptyMessage="Your discard pile is empty."
        opened={isDiscardModalOpen}
        title="Discard"
        onClose={closeDiscardModal}
      />
      <CardGridModal
        cards={playerTrashPile}
        emptyMessage="Your trash pile is empty."
        opened={isTrashModalOpen}
        title="Trash"
        onClose={closeTrashModal}
      />
      <CardGridModal
        cards={playerScoreArea}
        emptyMessage="Your score is empty."
        opened={isScoreModalOpen}
        title="Score"
        onClose={closeScoreModal}
      />
    </>
  );
};
