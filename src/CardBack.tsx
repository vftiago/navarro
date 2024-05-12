import { Card, Image } from "@mantine/core";
import { SizeT, sizes } from "./cardSizes";

export const CardBack = ({ size = "xs" }: { size?: SizeT }) => {
  const GREY_CARD_BACK = "_787cb567-ce4a-463a-b131-08522b7b43c1.jpeg";

  return (
    <Card
      shadow="lg"
      padding="0"
      radius="md"
      w={sizes[size].w}
      h={sizes[size].h}
      withBorder
      className="hover:border-amber-100"
    >
      <Card.Section>
        <Image
          src={`./assets/${GREY_CARD_BACK}`}
          alt="Card back"
          h={sizes[size].h}
        />
      </Card.Section>
    </Card>
  );
};
