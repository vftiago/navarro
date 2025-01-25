import { CardFront } from "../CardFront";
import { CardKeywordT, PlayingCardT } from "../cards/cards";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { calculateCardRotations, calculateCardTopValues } from "./utils";
import { EXIT_ANIMATION_DURATION } from "../constants";

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

export const PlayerHand = ({
  animationKey,
  playerCards,
  onClick,
}: {
  animationKey: number;
  playerCards: PlayingCardT[];
  onClick: (card: PlayingCardT, index: number) => void;
}) => {
  const [scope, animate] = useAnimate();

  const rotationValues = calculateCardRotations(playerCards.length);
  const topValues = calculateCardTopValues(playerCards.length);

  const handleCardClick = (card: PlayingCardT, index: number) => {
    if (card.keywords?.includes(CardKeywordT.UNPLAYABLE)) {
      return;
    }

    const cardElement = document.getElementById(card.deckContextId);

    if (!cardElement) {
      return;
    }

    void animate(
      cardElement,
      { opacity: 0, y: -100, rotate: 0 },
      {
        duration: EXIT_ANIMATION_DURATION / 1000,
      },
    );

    onClick(card, index);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.ol
        key={animationKey}
        ref={scope}
        animate="show"
        className="flex ml-24"
        exit="exit"
        initial="hidden"
        variants={containerVariants}
      >
        {playerCards.map((card, index) => {
          return (
            <motion.li
              key={card.deckContextId}
              className="-ml-24 list-none relative"
              id={card.deckContextId}
              style={{
                top: topValues[index],
                rotate: rotationValues[index],
              }}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                top: -50,
                rotate: 0,
                zIndex: 1,
              }}
              onClick={() => {
                handleCardClick(card, index);
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
