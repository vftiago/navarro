import { CardFront } from "../Card/CardFront";
import { Keyword, PlayingCardT } from "../../cards/card";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { calculateCardRotations, calculateCardTopValues } from "./utils";
import { EXIT_ANIMATION_DURATION } from "../constants";
import { GameState } from "../../gameReducer";

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
  gameState,
  animationKey,
  playerCards,
  onClick,
}: {
  gameState: GameState;
  animationKey: number;
  playerCards: PlayingCardT[];
  onClick: (card: PlayingCardT, index: number) => void;
}) => {
  const [scope, animate] = useAnimate();

  const rotationValues = calculateCardRotations(playerCards.length);
  const topValues = calculateCardTopValues(playerCards.length);

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
        className="flex ml-24 relative top-6"
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
                top: -40,
                rotate: 0,
                zIndex: 1,
              }}
              onClick={() => {
                handleCardClick(card, index);
              }}
            >
              <CardFront card={card} gameState={gameState} />
            </motion.li>
          );
        })}
      </motion.ol>
    </AnimatePresence>
  );
};
