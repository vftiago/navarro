import { CardFront } from "../CardFront";
import { CardT } from "../cards/cards";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { stagger } from "framer-motion/dom";
import { useEffect, useState } from "react";
import { calculateCardRotations, calculateCardTopValues } from "./utils";

const EXIT_ANIMATION_DURATION = 200;

export const PlayerHand = ({
  isNewTurn,
  playerCards,
  onClick,
}: {
  isNewTurn: boolean;
  playerCards: CardT[];
  onClick: (card: CardT, index: number) => void;
}) => {
  const [scope, animate] = useAnimate();
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const rotationValues = calculateCardRotations(playerCards.length);
  const topValues = calculateCardTopValues(playerCards.length);

  const cardVariants = playerCards.map((_, index) => ({
    initial: {
      y: isNewTurn ? 100 : 0,
      opacity: isNewTurn ? 0 : 1,
      rotate: rotationValues[index],
      top: topValues[index],
    },
    animate: {
      y: 0,
    },
    whileHover: {
      scale: 1.1,
      zIndex: 10,
      y: -30,
      rotate: 0,
      top: 0,
    },
    exit: {
      opacity: 0,
      y: -100,
      transition: { duration: EXIT_ANIMATION_DURATION / 1000 },
    },
  }));

  useEffect(() => {
    if (!isNewTurn) return;

    void animate(
      "li",
      { opacity: 1, y: 0 },
      { delay: stagger(0.05, { startDelay: 0.15 }) },
    );
  }, [animate, isNewTurn]);

  const handleCardClick = (card: CardT, index: number) => {
    /**
     * we're essentially triggering a rerender by setting a new state which results
     * in rendering all cards except the one that was clicked,
     * thus ensuring its exit animation can playbefore the entire component is remounted
     */
    setRemovingIndex(index);

    setTimeout(() => {
      onClick(card, index);
    }, EXIT_ANIMATION_DURATION);
  };

  return (
    <ol ref={scope} className="flex ml-24">
      <AnimatePresence>
        {playerCards.map((card, index) => {
          if (index === removingIndex) return null;

          return (
            <motion.li
              key={card.deckContextId}
              animate="animate"
              className="-ml-24 list-none relative"
              exit="exit"
              initial="initial"
              variants={cardVariants[index]}
              whileHover="whileHover"
              onClick={() => handleCardClick(card, index)}
            >
              <CardFront card={card} />
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
};
