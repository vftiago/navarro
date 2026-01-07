import type { ComponentProps } from "react";
import { CardType } from "../../../cardDefinitions/card";
import { getFullArt } from "../../../state/settings";
import { useGameStore } from "../../../state/store";
import { CardFrontFullArt } from "../CardFrontFullArt";
import { CardFrontGeneric } from "./CardFrontGeneric";
import { CardFrontIce } from "./CardFrontIce";

type CardFrontProps = Omit<
  ComponentProps<typeof CardFrontGeneric | typeof CardFrontIce>,
  "size"
> & {
  isBeingEncountered?: boolean;
  onClick?: () => void;
};

export const CardFront = (props: CardFrontProps) => {
  const { card, isBeingEncountered, onClick } = props;
  const fullArt = useGameStore(getFullArt);

  if (fullArt) {
    return <CardFrontFullArt card={card} />;
  }

  if (card.type === CardType.ICE) {
    return (
      <CardFrontIce
        card={card}
        isBeingEncountered={isBeingEncountered}
        onClick={onClick}
      />
    );
  }

  return <CardFrontGeneric card={card} />;
};
