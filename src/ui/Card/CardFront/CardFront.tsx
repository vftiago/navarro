import { ComponentProps } from "react";
import { CardType } from "../../../cardDefinitions/card";
import { CardFrontAgenda } from "./CardFrontAgenda";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontIce } from "./CardFrontIce";
import { CardFrontProgram } from "./CardFrontProgram";

export const CardFront = (
  props: Omit<
    ComponentProps<
      | typeof CardFrontProgram
      | typeof CardFrontIce
      | typeof CardFrontAgenda
      | typeof CardFrontDefault
    >,
    "size"
  >,
) => {
  const { card } = props;

  switch (card.type) {
    case CardType.PROGRAM:
      return <CardFrontProgram card={card} />;
    case CardType.ICE:
      return <CardFrontIce card={card} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} />;
    default:
      return <CardFrontDefault card={card} />;
  }
};
