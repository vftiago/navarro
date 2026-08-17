import type { CardDefinition } from "../../../cards/definitions";
import { getCardTextLines } from "../../../cards/engine";
import { CardType } from "../../../cards/enums";
import { CardFrontLayout } from "./CardFrontLayout";

type CardFrontGenericProps = {
  definition: Exclude<CardDefinition, { type: CardType.ICE }>;
};

export const CardFrontGeneric = ({ definition }: CardFrontGenericProps) => {
  const { flavorText, image, name, rarity, type } = definition;

  const isAgenda = type === CardType.AGENDA;
  const subtype = "subtype" in definition ? definition.subtype : undefined;

  return (
    <CardFrontLayout
      flavorText={flavorText}
      image={image}
      name={name}
      rarity={rarity}
      subtype={subtype}
      textLines={getCardTextLines(definition)}
      titleClassName={isAgenda ? "text-yellow-300" : undefined}
      type={type}
    />
  );
};
