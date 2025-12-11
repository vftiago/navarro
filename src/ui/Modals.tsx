import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../state/store";
import { CardGridModal } from "./CardGridModal";

export type ModalType = "deck" | "discard" | "score" | "trash" | null;

const MODAL_CONFIG: Record<
  Exclude<ModalType, null>,
  {
    emptyMessage: string;
    stateKey:
      | "playerDeck"
      | "playerDiscardPile"
      | "playerScoreArea"
      | "playerTrashPile";
    title: string;
  }
> = {
  deck: {
    emptyMessage: "Your deck is empty.",
    stateKey: "playerDeck",
    title: "Deck",
  },
  discard: {
    emptyMessage: "Your discard pile is empty.",
    stateKey: "playerDiscardPile",
    title: "Discard",
  },
  score: {
    emptyMessage: "Your score is empty.",
    stateKey: "playerScoreArea",
    title: "Score",
  },
  trash: {
    emptyMessage: "Your trash pile is empty.",
    stateKey: "playerTrashPile",
    title: "Trash",
  },
};

export const Modals = ({
  closeModal,
  openModal,
}: {
  closeModal: () => void;
  openModal: ModalType;
}) => {
  const { playerDeck, playerDiscardPile, playerScoreArea, playerTrashPile } =
    useGameStore(
      useShallow((state) => ({
        playerDeck: state.playerState.playerDeck,
        playerDiscardPile: state.playerState.playerDiscardPile,
        playerScoreArea: state.playerState.playerScoreArea,
        playerTrashPile: state.playerState.playerTrashPile,
      })),
    );

  const cardPiles = {
    playerDeck,
    playerDiscardPile,
    playerScoreArea,
    playerTrashPile,
  };

  if (!openModal) {
    return (
      <CardGridModal
        cards={[]}
        emptyMessage=""
        opened={false}
        title=""
        onClose={closeModal}
      />
    );
  }

  const config = MODAL_CONFIG[openModal];

  return (
    <CardGridModal
      cards={cardPiles[config.stateKey]}
      emptyMessage={config.emptyMessage}
      opened={true}
      title={config.title}
      onClose={closeModal}
    />
  );
};
