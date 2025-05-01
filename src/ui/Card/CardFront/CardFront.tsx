import { CardDefinitions, CardType } from "../../../cardDefinitions/card";

import { CardFrontIce } from "./CardFrontIce";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";

export const CardFront = ({
  card,
  size = "xs",
}: {
  card: CardDefinitions;
  size?: "xs" | "sm" | "md";
}) => {
  switch (card.type) {
    case CardType.ICE:
      return <CardFrontIce card={card} size={size} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} size={size} />;
    default:
      return <CardFrontDefault card={card} size={size} />;
  }
};
