import { Card, Image } from "@mantine/core";
import { CARD_SIZES } from "./cardSizes";

export const CardBack = ({
  size = "xs",
  orientation = "vertical",
}: {
  size?: "xs" | "sm" | "md";
  orientation?: "vertical" | "horizontal";
}) => {
  const GREY_CARD_BACK = "_787cb567-ce4a-463a-b131-08522b7b43c1.jpeg";

  return (
    <Card
      withBorder
      className="hover:border-amber-100"
      h={`${CARD_SIZES[size].h}rem`}
      padding="0"
      radius="md"
      shadow="lg"
      style={{ transform: orientation === "horizontal" ? "rotate(90deg)" : "" }}
      w={`${CARD_SIZES[size].w}rem`}
    >
      <Card.Section>
        <Image
          alt="Card back"
          h={`${CARD_SIZES[size].h}rem`}
          src={`./assets/${GREY_CARD_BACK}`}
        />
      </Card.Section>
    </Card>
  );
};
