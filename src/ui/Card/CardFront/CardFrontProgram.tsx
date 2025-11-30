import type { ProgramCardDefinitions } from "../../../cardDefinitions/card";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontProgram = ({
  card,
}: {
  card: ProgramCardDefinitions;
}) => {
  const { cardEffects, flavorText, image, name, rarity, subtype, type } = card;

  return (
    <CardFrontLayout
      cardEffects={cardEffects}
      flavorText={flavorText}
      image={image}
      name={name}
      rarity={rarity}
      subtype={subtype}
      type={type}
    />
  );
};
