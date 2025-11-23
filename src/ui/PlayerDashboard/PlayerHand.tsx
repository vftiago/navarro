import { Text } from "@mantine/core";
import clsx from "clsx";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Keyword, PlayingCard } from "../../cardDefinitions/card";
import { useThunk } from "../../context/useThunk";
import { TurnPhase } from "../../state/reducers/turnReducer";
import { startPlayPhase } from "../../state/thunks";
import { useGameStore } from "../../store/gameStore";
import { CardFront } from "../Card/CardFront";
import { calculateCardRotations, calculateCardTopValues } from "./utils";

const EXIT_ANIMATION_DURATION = 200;

const containerVariants = {
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  exit: {
    opacity: 0,
    y: -100,
  },
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};

export const PlayerHand = () => {
  const { playerHand, turnCurrentPhase } = useGameStore(
    useShallow((state) => ({
      playerHand: state.playerState.playerHand,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
    })),
  );

  const dispatchThunk = useThunk();
  const [, animate] = useAnimate();

  const [exitingCards, setExitingCards] = useState<Set<string>>(new Set());
  const [showEmptyMessage, setShowEmptyMessage] = useState(
    playerHand.length === 0,
  );

  const [animationKey, setAnimationKey] = useState(0);

  const cardRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    if (turnCurrentPhase === TurnPhase.End || playerHand.length === 0) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [turnCurrentPhase, playerHand.length]);

  useEffect(() => {
    if (playerHand.length === 0 && turnCurrentPhase === TurnPhase.Main) {
      setShowEmptyMessage(true);
    } else {
      setShowEmptyMessage(false);
    }
  }, [playerHand, turnCurrentPhase]);

  useEffect(() => {
    const currentCardIds = new Set(
      playerHand.map((card) => card.deckContextId),
    );

    for (const [id] of cardRefs.current) {
      if (!currentCardIds.has(id)) {
        cardRefs.current.delete(id);
      }
    }
  }, [playerHand]);

  const rotationValues = calculateCardRotations(playerHand.length);
  const topValues = calculateCardTopValues(playerHand.length);

  const handleCardClick = useCallback(
    (card: PlayingCard, index: number) => {
      if (
        card.cardEffects?.some(
          (effect) => effect.keyword === Keyword.UNPLAYABLE,
        )
      ) {
        return;
      }

      const cardElement = cardRefs.current.get(card.deckContextId);

      if (!cardElement) {
        return;
      }

      setExitingCards((prev) => new Set(prev).add(card.deckContextId));

      void animate(
        cardElement,
        { opacity: 0, rotate: 0, y: -100 },
        {
          duration: EXIT_ANIMATION_DURATION / 1000,
        },
      );

      setTimeout(() => {
        setExitingCards((prev) => {
          const next = new Set(prev);
          next.delete(card.deckContextId);
          return next;
        });

        dispatchThunk(startPlayPhase(card, index));
      }, EXIT_ANIMATION_DURATION);
    },
    [animate, dispatchThunk],
  );

  const setCardRef = useCallback(
    (id: string, element: HTMLLIElement | null) => {
      if (element) {
        cardRefs.current.set(id, element);
      } else {
        cardRefs.current.delete(id);
      }
    },
    [],
  );

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
        layout
        animate="show"
        className="flex ml-24 relative top-6"
        exit="exit"
        initial="hidden"
        key={animationKey}
        transition={{
          layout: { damping: 100, stiffness: 2400, type: "spring" },
        }}
        variants={containerVariants}
      >
        {playerHand.map((card, index) => {
          const isExiting = exitingCards.has(card.deckContextId);

          return (
            <motion.li
              layout
              className={clsx("-ml-24 list-none relative", {
                "pointer-events-none": isExiting,
              })}
              key={card.deckContextId}
              ref={(el) => setCardRef(card.deckContextId, el)}
              style={{
                rotate: isExiting ? 0 : rotationValues[index],
                scale: isExiting ? 1.1 : 1,
                top: isExiting ? topValues[index] - 40 : topValues[index],
              }}
              variants={itemVariants}
              whileHover={{
                rotate: 0,
                scale: 1.1,
                top: -40,
                zIndex: 1,
              }}
              onClick={() => {
                if (!isExiting) {
                  handleCardClick(card, index);
                }
              }}
            >
              <CardFront card={card} />
            </motion.li>
          );
        })}
      </motion.ol>
    </AnimatePresence>
  );
};
