import { CardType } from "../../../cardDefinitions/card";

import { CardFrontIce } from "./CardFrontIce";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";
import { CardFrontProgram } from "./CardFrontProgram";
import { ComponentProps } from "react";

const CARD_SIZE = "xs";

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
      return <CardFrontProgram card={card} size={CARD_SIZE} />;
    case CardType.ICE:
      return <CardFrontIce card={card} size={CARD_SIZE} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} size={CARD_SIZE} />;
    default:
      return <CardFrontDefault card={card} size={CARD_SIZE} />;
  }
};
