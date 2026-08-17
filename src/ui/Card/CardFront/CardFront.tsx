import { CardType } from "../../../cards/enums";
import type { CardInstance } from "../../../cards/instance";
import { resolveCard } from "../../../cards/instance";
import { getFullArt } from "../../../state/settings";
import { useGameStore } from "../../../state/store";
import { CardFrontFullArt } from "../CardFrontFullArt";
import { CardFrontGeneric } from "./CardFrontGeneric";
import { CardFrontIce } from "./CardFrontIce";

type CardFrontProps = {
  card: CardInstance;
  isBeingEncountered?: boolean;
  onClick?: () => void;
};

export const CardFront = ({
  card,
  isBeingEncountered,
  onClick,
}: CardFrontProps) => {
  const fullArt = useGameStore(getFullArt);
  const definition = resolveCard(card);

  if (fullArt) {
    return <CardFrontFullArt definition={definition} />;
  }

  if (definition.type === CardType.ICE) {
    return (
      <CardFrontIce
        definition={definition}
        instance={card}
        isBeingEncountered={isBeingEncountered}
        onClick={onClick}
      />
    );
  }

  return <CardFrontGeneric definition={definition} onClick={onClick} />;
};
