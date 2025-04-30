import { CardFront } from "../Card/CardFront";
import { Keyword, PlayingCardT } from "../../cards/card";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { calculateCardRotations, calculateCardTopValues } from "./utils";
import { EXIT_ANIMATION_DURATION } from "../constants";
import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import clsx from "clsx";
import { useThunk } from "../../context/useThunk";
import { useGameState } from "../../context/useGameState";
import { getTurnCurrentPhase, getPlayerHand } from "../../state/selectors";
import { GamePhase } from "../../state/types";
import { executePlayPhase } from "../../state/thunks";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -100,
  },
};

export const PlayerHand = () => {
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const playerHand = getPlayerHand(gameState);

  const [visibleCards, setVisibleCards] = useState<PlayingCardT[]>(playerHand);
  const [exitingCards, setExitingCards] = useState<string[]>([]);
  const [showEmptyMessage, setShowEmptyMessage] = useState(
    playerHand.length === 0,
  );

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (playerHand.length === 0 && turnCurrentPhase === GamePhase.Main) {
      setShowEmptyMessage(true);
    } else {
      setShowEmptyMessage(false);
    }
  }, [playerHand, turnCurrentPhase]);

  useEffect(() => {
    if (turnCurrentPhase !== GamePhase.Discard) {
      setVisibleCards(playerHand);
    }
  }, [playerHand, turnCurrentPhase]);

  useEffect(() => {
    if (turnCurrentPhase === GamePhase.Discard && visibleCards.length > 0) {
      setExitingCards(visibleCards.map((card) => card.deckContextId));

      const timer = setTimeout(() => {
        setVisibleCards([]);
        setExitingCards([]);
      }, EXIT_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [turnCurrentPhase, visibleCards.length, playerHand.length, visibleCards]);

  const rotationValues = calculateCardRotations(visibleCards.length);
  const topValues = calculateCardTopValues(visibleCards.length);

  const handleCardClick = (card: PlayingCardT, index: number) => {
    if (
      card.cardEffects?.some((effect) => effect.keyword === Keyword.UNPLAYABLE)
    ) {
      return;
    }

    const cardElement = document.getElementById(card.deckContextId);

    if (!cardElement) {
      return;
    }

    setExitingCards((prev) => [...prev, card.deckContextId]);

    void animate(
      cardElement,
      { opacity: 0, y: -100, rotate: 0 },
      {
        duration: EXIT_ANIMATION_DURATION / 1000,
      },
    );

    setTimeout(() => {
      setVisibleCards((prev) =>
        prev.filter((c) => c.deckContextId !== card.deckContextId),
      );
      setExitingCards((prev) => prev.filter((id) => id !== card.deckContextId));
    }, EXIT_ANIMATION_DURATION);

    dispatchThunk(executePlayPhase(card, index));
  };

  if (showEmptyMessage) {
    return (
      <div className="flex items-center justify-center h-24">
        <Text>Your hand is empty.</Text>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.ol
        ref={scope}
        layout
        animate="show"
        className="flex ml-24 relative top-6"
        exit="exit"
        initial="hidden"
        transition={{
          layout: { type: "spring", stiffness: 2400, damping: 100 },
        }}
        variants={containerVariants}
      >
        {visibleCards.map((card, index) => {
          const isExiting = exitingCards.includes(card.deckContextId);

          return (
            <motion.li
              key={card.deckContextId}
              layout
              className={clsx("-ml-24 list-none relative", {
                "pointer-events-none": isExiting,
              })}
              id={card.deckContextId}
              style={{
                top: isExiting ? topValues[index] - 40 : topValues[index],
                rotate: isExiting ? 0 : rotationValues[index],
                scale: isExiting ? 1.1 : 1,
              }}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                top: -40,
                rotate: 0,
                zIndex: 1,
              }}
              onClick={() => {
                if (!isExiting) {
                  handleCardClick(card, index);
                }
              }}
            >
              <CardFront card={card} size="xs" />
            </motion.li>
          );
        })}
      </motion.ol>
    </AnimatePresence>
  );
};
