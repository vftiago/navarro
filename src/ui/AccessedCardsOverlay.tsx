import { Button, Text } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { GameEventType, useEventBus } from "../state/events";
import { useGameStore } from "../state/store";
import { RunProgressState, TurnPhase } from "../state/turn";
import { CardFront } from "./Card/CardFront";

export const AccessedCardsOverlay = () => {
  const { playerAccessedCards, runProgressState, turnCurrentPhase } =
    useGameStore(
      useShallow((state) => ({
        playerAccessedCards: state.playerState.playerAccessedCards,
        runProgressState: state.turnState.runProgressState,
        turnCurrentPhase: state.turnState.turnCurrentPhase,
      })),
    );

  const eventBus = useEventBus();
  const [isPeeking, setIsPeeking] = useState(false);

  const isVisible =
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ACCESSING_CARDS &&
    playerAccessedCards.length > 0;

  const handleCardClick = (card: (typeof playerAccessedCards)[0]) => {
    eventBus.emit({
      payload: { cardId: card.deckContextId },
      type: GameEventType.PLAYER_SELECT_ACCESSED_CARD,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isPeeking && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <div className="relative flex items-center">
            <Text className="font-orbitron absolute bottom-full left-1/2 mb-6 -translate-x-1/2 text-3xl text-white">
              Accessed Granted
            </Text>

            <div className="flex gap-8">
              {playerAccessedCards.map((card) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  key={card.deckContextId}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleCardClick(card)}
                >
                  <CardFront card={card} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      <Button
        className="fixed top-1/2 left-6 z-50 -translate-y-1/2 rounded-sm"
        size="lg"
        variant="default"
        onClick={() => setIsPeeking((prev) => !prev)}
      >
        <FiEye size={32} />
      </Button>
    </AnimatePresence>
  );
};
