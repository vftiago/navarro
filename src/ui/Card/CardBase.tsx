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
        withBorder
        className="select-none hover:cursor-pointer rounded-md"
        padding="0"
        {...cardSize}
      >
        {children}
      </Card>
    </CardHoverEffect>
  );
};
