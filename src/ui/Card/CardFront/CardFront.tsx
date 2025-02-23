import { CardPropertiesT, CardType } from "../../../cards/card";

import { GameState } from "../../../gameReducer";
import { CardFrontICE } from "./CardFrontICE";
import { CardFrontDefault } from "./CardFrontDefault";
import { CardFrontAgenda } from "./CardFrontAgenda";

export const CardFront = ({
  card,
  size = "sm",
  gameState,
}: {
  card: CardPropertiesT;
  size?: "xs" | "sm" | "md";
  gameState: GameState;
}) => {
  switch (card.type) {
    case CardType.ICE:
      return <CardFrontICE card={card} gameState={gameState} size={size} />;
    case CardType.AGENDA:
      return <CardFrontAgenda card={card} size={size} />;
    default:
      return <CardFrontDefault card={card} size={size} />;
  }
};
