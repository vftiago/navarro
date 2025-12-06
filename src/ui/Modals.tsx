import { Flex, Modal } from "@mantine/core";
import { motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { useGameStore } from "../state/store";
import { CardFront } from "./Card/CardFront";
import { CardGridModal } from "./CardGridModal";

export const Modals = ({
  closeCardDisplayModal,
  closeDeckModal,
  closeDiscardModal,
  closeScoreModal,
  closeTrashModal,
  isCardDisplayModalOpen,
  isDeckModalOpen,
  isDiscardModalOpen,
  isScoreModalOpen,
  isTrashModalOpen,
}: {
  closeCardDisplayModal: () => void;
  closeDeckModal: () => void;
  closeDiscardModal: () => void;
  closeScoreModal: () => void;
  closeTrashModal: () => void;
  isCardDisplayModalOpen: boolean;
  isDeckModalOpen: boolean;
  isDiscardModalOpen: boolean;
  isScoreModalOpen: boolean;
  isTrashModalOpen: boolean;
}) => {
  const {
    playerAccessedCards,
    playerDeck,
    playerDiscardPile,
    playerScoreArea,
    playerTrashPile,
  } = useGameStore(
    useShallow((state) => ({
      playerAccessedCards: state.playerState.playerAccessedCards,
      playerDeck: state.playerState.playerDeck,
      playerDiscardPile: state.playerState.playerDiscardPile,
      playerScoreArea: state.playerState.playerScoreArea,
      playerTrashPile: state.playerState.playerTrashPile,
    })),
  );

  const eventBus = useEventBus();

  const handleCardClick = (card: (typeof playerAccessedCards)[0]) => {
    // Emit event to select accessed card
    // Event handler will validate and transition to End subphase
    eventBus.emit({
      payload: { cardId: card.deckContextId },
      type: GameEventType.PLAYER_SELECT_ACCESSED_CARD,
    });

    // Close modal after selection
    closeCardDisplayModal();
  };

  return (
    <>
      <Modal.Root
        opened={isCardDisplayModalOpen}
        padding={0}
        size="auto"
        onClose={closeCardDisplayModal}
      >
        <Modal.Overlay />
        <Modal.Content className="overflow-visible bg-transparent">
          <Flex gap={32}>
            {playerAccessedCards?.map((card, index) => {
              return (
                <motion.div
                  key={index}
                  style={{ cursor: "pointer" }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleCardClick(card)}
                >
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
