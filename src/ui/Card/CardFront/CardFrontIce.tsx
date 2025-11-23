import clsx from "clsx";
import { IcePlayingCard } from "../../../cardDefinitions/card";
import { useGameState } from "../../../context/useGameState";
import { getIceStrength } from "../../../state/selectors";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontIce = ({ card }: { card: IcePlayingCard }) => {
  const { gameState } = useGameState();
  const { cardEffects, flavorText, image, name, rarity, subtype, type } = card;

  const currentStrength = getIceStrength(gameState, card);
  const baseStrength = card.getStrength(gameState);

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
