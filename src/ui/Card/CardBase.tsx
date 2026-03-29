import { Card } from "@mantine/core";
import type { ReactNode } from "react";
import type { CardType } from "../../cardDefinitions/card";
import { getCardSize } from "../../state/settings";
import { getGameState } from "../../state/store";
import { CardHoverEffect } from "./CardHoverEffect";

type CardBaseProps = {
  children?: ReactNode;
  isBeingEncountered?: boolean;
  onClick?: () => void;
  type?: CardType;
};

export const CardBase = ({
  children,
  isBeingEncountered,
  onClick,
  type,
}: CardBaseProps) => {
  const cardSize = getCardSize(getGameState());

  return (
    <CardHoverEffect
      isBeingEncountered={isBeingEncountered}
      type={type}
      onClick={onClick}
    >
      <Card
        className="relative flex flex-col rounded-md border border-x-white/10 border-t-white/20 border-b-white/4 bg-neutral-800 select-none hover:cursor-pointer"
        padding="0"
        {...cardSize}
      >
        {children}
      </Card>
    </CardHoverEffect>
  );
};
