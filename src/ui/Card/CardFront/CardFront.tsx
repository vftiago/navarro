import { CardType } from "../../../cardDefinitions/card";

import { CardFrontIce } from "./CardFrontIce";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";
import { CardFrontProgram } from "./CardFrontProgram";
import { ComponentProps } from "react";

export const CardFront = (
  props: ComponentProps<
    | typeof CardFrontProgram
    | typeof CardFrontIce
    | typeof CardFrontAgenda
    | typeof CardFrontDefault
  >,
) => {
  const { card, size = "xs" } = props;

  switch (card.type) {
    case CardType.PROGRAM:
      return <CardFrontProgram card={card} size={size} />;
    case CardType.ICE:
      return <CardFrontIce card={card} size={size} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} size={size} />;
    default:
      return <CardFrontDefault card={card} size={size} />;
  }
};
