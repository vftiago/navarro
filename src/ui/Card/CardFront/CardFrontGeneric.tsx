import {
  CardType,
  type AgendaCardDefinitions,
  type ProgramCardDefinitions,
  type ServerCardDefinitions,
} from "../../../cardDefinitions/card";
import { CardFrontLayout } from "./CardFrontLayout";

type CardFrontGenericProps = {
  card: AgendaCardDefinitions | ProgramCardDefinitions | ServerCardDefinitions;
};

export const CardFrontGeneric = ({ card }: CardFrontGenericProps) => {
  const { cardEffects, flavorText, image, name, rarity, type } = card;

  const isAgenda = type === CardType.AGENDA;
  const subtype = "subtype" in card ? card.subtype : undefined;

  return (
    <CardFrontLayout
      cardEffects={cardEffects}
      flavorText={flavorText}
      image={image}
      name={name}
      rarity={rarity}
      subtype={subtype}
      titleClassName={isAgenda ? "text-yellow-300" : undefined}
      type={type}
    />
  );
};
