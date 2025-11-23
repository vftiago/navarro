import { Container, Flex, Modal, Stack, Text } from "@mantine/core";
import { PlayingCard } from "../cardDefinitions/card";
import { CardFront } from "./Card/CardFront";

type CardGridModalProps = {
  cards: PlayingCard[];
  emptyMessage: string;
  opened: boolean;
  title: string;
  onClose: () => void;
};

export const CardGridModal = ({
  cards,
  emptyMessage,
  opened,
  title,
  onClose,
}: CardGridModalProps) => {
  return (
    <Modal fullScreen opened={opened} title={title} onClose={onClose}>
      <Container size="1360px">
        <Flex gap={32} wrap="wrap">
          {cards.length ? (
            cards.map((card, index) => <CardFront key={index} card={card} />)
          ) : (
            <Stack align="center" h="400px" justify="center" w="100%">
              <Text>{emptyMessage}</Text>
            </Stack>
          )}
        </Flex>
      </Container>
    </Modal>
  );
};
