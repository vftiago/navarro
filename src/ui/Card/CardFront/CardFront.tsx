import { CardType } from "../../../cardDefinitions/card";

import { CardFrontIce } from "./CardFrontIce";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";
import { CardFrontProgram } from "./CardFrontProgram";
import { ComponentProps } from "react";

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
