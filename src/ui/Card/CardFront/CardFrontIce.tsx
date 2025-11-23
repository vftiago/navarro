import clsx from "clsx";
import { IcePlayingCard } from "../../../cardDefinitions/card";
import { getGameState, useGameStore } from "../../../store/gameStore";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontIce = ({ card }: { card: IcePlayingCard }) => {
  const boardState = useGameStore((state) => state.boardState);

  const { cardEffects, flavorText, image, name, rarity, subtype, type } = card;

  // Calculate strength using current state
  const gameState = getGameState();
  const baseStrength = card.getStrength(gameState);

  // Calculate modified strength
  const relevantEffects = boardState.permanentEffects.filter(
    (effect) => effect.targetSelector === "getIceStrength",
  );

  const modifier = relevantEffects.reduce((acc, { getModifier, sourceId }) => {
    const mod = getModifier({
      gameState,
      sourceId,
      targetId: card.deckContextId,
    });
    return acc + mod;
  }, 0);

  const currentStrength = baseStrength + modifier;

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
      name={name}
      overlay={strengthOverlay}
      rarity={rarity}
      subtype={subtype}
      type={type}
    />
  );
};
