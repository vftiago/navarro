import clsx from "clsx";
import type { IcePlayingCard } from "../../../cardDefinitions/card";
import { getGameState, useGameStore } from "../../../state/store";
import { calculateIceStrength } from "../../../state/utils/iceStrengthUtils";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontIce = ({
  card,
  isBeingEncountered,
  onClick,
}: {
  card: IcePlayingCard;
  isBeingEncountered?: boolean;
  onClick?: () => void;
}) => {
  // Subscribe to board state to trigger re-renders when effects change
  useGameStore((state) => state.boardState);

  const { cardEffects, flavorText, image, name, rarity, subtype, type } = card;

  // Calculate strength using utility
  const gameState = getGameState();
  const { base: baseStrength, current: currentStrength } = calculateIceStrength(
    card,
    gameState,
  );

  const strengthOverlay = (
    <div
      className={clsx(
        "absolute flex items-center font-bold justify-center border-1 border-gray-500 rounded-md size-6 right-0 m-1 bottom-0",
        {
          "text-green-300": currentStrength > baseStrength,
          "text-red-300": currentStrength < baseStrength,
        },
      )}
    >
      {currentStrength}
    </div>
  );

  return (
    <CardFrontLayout
      cardEffects={cardEffects}
      flavorText={flavorText}
      image={image}
      isBeingEncountered={isBeingEncountered}
      name={name}
      overlay={strengthOverlay}
      rarity={rarity}
      subtype={subtype}
      type={type}
      onClick={onClick}
    />
  );
};
