import type { AgendaCardDefinitions } from "../../../cardDefinitions/card";
import { CardFrontLayout } from "./CardFrontLayout";

export const CardFrontAgenda = ({ card }: { card: AgendaCardDefinitions }) => {
  const { cardEffects, flavorText, image, name, rarity, type } = card;

  return (
    <CardFrontLayout
      cardEffects={cardEffects}
      flavorText={flavorText}
      image={image}
      name={name}
      rarity={rarity}
      titleClassName="text-yellow-300"
      type={type}
    />
  );
};
