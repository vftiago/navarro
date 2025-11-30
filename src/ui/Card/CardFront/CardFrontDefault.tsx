import {
  type ProgramCardDefinitions,
  type ServerCardDefinitions,
} from "../../../cardDefinitions/card";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontDefault = ({
  card,
}: {
  card: ServerCardDefinitions | ProgramCardDefinitions;
}) => {
  const { cardEffects, flavorText, image, name, rarity, type } = card;

  return (
    <CardFrontLayout
      cardEffects={cardEffects}
      flavorText={flavorText}
      image={image}
      name={name}
      rarity={rarity}
      type={type}
    />
  );
};
