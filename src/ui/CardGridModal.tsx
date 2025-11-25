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
  onClose,
  opened,
  title,
}: CardGridModalProps) => {
  return (
    <Modal fullScreen opened={opened} title={title} onClose={onClose}>
      <Container className="pt-8" size="1360px">
        <Flex gap={32} wrap="wrap">
          {cards.length ? (
            cards.map((card, index) => <CardFront card={card} key={index} />)
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
