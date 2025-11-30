import type { ComponentProps } from "react";
import { CardType } from "../../../cardDefinitions/card";
import { CardFrontAgenda } from "./CardFrontAgenda";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontIce } from "./CardFrontIce";
import { CardFrontProgram } from "./CardFrontProgram";

type CardFrontProps = Omit<
  ComponentProps<
    | typeof CardFrontProgram
    | typeof CardFrontIce
    | typeof CardFrontAgenda
    | typeof CardFrontDefault
  >,
  "size"
> & {
  isBeingEncountered?: boolean;
  onClick?: () => void;
};

export const CardFront = (props: CardFrontProps) => {
  const { card, isBeingEncountered, onClick } = props;

  switch (card.type) {
    case CardType.PROGRAM:
      return <CardFrontProgram card={card} />;
    case CardType.ICE:
      return (
        <CardFrontIce
          card={card}
          isBeingEncountered={isBeingEncountered}
          onClick={onClick}
        />
      );
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} />;
    default:
      return <CardFrontDefault card={card} />;
  }
};
