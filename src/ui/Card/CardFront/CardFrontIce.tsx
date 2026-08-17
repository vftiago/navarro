import clsx from "clsx";
import type { IceCardDefinition } from "../../../cards/definitions";
import { getCardTextLines } from "../../../cards/engine";
import type { CardInstance } from "../../../cards/instance";
import { getGameState, useGameStore } from "../../../state/store";
import { calculateIceStrength } from "../../../state/utils/iceStrengthUtils";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontIce = ({
  definition,
  instance,
  isBeingEncountered,
  onClick,
}: {
  definition: IceCardDefinition;
  instance: CardInstance;
  isBeingEncountered?: boolean;
  onClick?: () => void;
}) => {
  // Subscribe to board state to trigger re-renders when effects change
  useGameStore((state) => state.boardState);

  const { flavorText, image, name, rarity, subtype, type } = definition;

  // Calculate strength using utility
  const gameState = getGameState();
  const { base: baseStrength, current: currentStrength } = calculateIceStrength(
    instance,
    definition,
    gameState,
  );

  const strengthOverlay = (
    <div
      className={clsx(
        "absolute right-0 bottom-0 m-1 flex size-6 items-center justify-center rounded-md border-1 border-gray-500 font-bold",
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
      flavorText={flavorText}
      image={image}
      isBeingEncountered={isBeingEncountered}
      name={name}
      overlay={strengthOverlay}
      rarity={rarity}
      subtype={subtype}
      textLines={getCardTextLines(definition)}
      type={type}
      onClick={onClick}
    />
  );
};
