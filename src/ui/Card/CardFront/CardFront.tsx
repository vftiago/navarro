import { CardPropertiesT, CardType } from "../../../cards/card";

import { CardFrontICE } from "./CardFrontICE";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";

export const CardFront = ({
  card,
  size = "sm",
}: {
  card: CardPropertiesT;
  size?: "xs" | "sm" | "md";
}) => {
  switch (card.type) {
    case CardType.ICE:
      return <CardFrontICE card={card} size={size} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} size={size} />;
    default:
      return <CardFrontDefault card={card} size={size} />;
  }
};
