import { Button, Container, Flex, Stack } from "@mantine/core";
import { ClickWidget } from "./ClickWidget";
import { TagWidget } from "./TagWidget";
import { PlayerHand } from "./PlayerHand";
import { useGameState } from "../../context/useGameState";
import { GamePhase } from "../../gameReducer";
import { PlayingCardT } from "../../cards/card";

export const PlayerDashboard = ({
  onClickPlayerCard,
  onClickEndTurn,
  openDeckModal,
  openDiscardModal,
  openTrashModal,
  openScoreModal,
}: {
  onClickPlayerCard: (card: PlayingCardT, index: number) => void;
  onClickEndTurn: () => void;
  openDeckModal: () => void;
  openDiscardModal: () => void;
  openTrashModal: () => void;
  openScoreModal: () => void;
}) => {
  const {
    gameState: { animationKey, player, currentPhase, currentTurn, tick },
  } = useGameState();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <Container fluid maw={1620} p="lg">
        <Flex className="justify-between items-end">
          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({player.currentDeck.length})
            </Button>
            <ClickWidget remainingClicks={tick} />
            <TagWidget tagCount={player.tags} />
          </Stack>

          {currentPhase === GamePhase.Main && player.hand.length === 0 ? (
            <div>Your hand is empty.</div>
          ) : (
            <PlayerHand key={animationKey} onClick={onClickPlayerCard} />
          )}

          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={onClickEndTurn}>
              End turn ({currentTurn})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openDiscardModal}
            >
              Discard ({player.discard.length})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openTrashModal}
            >
              Trash ({player.trash.length})
            </Button>
            <Button
              className="self-end"
              color="yellow"
              size="sm"
              w="8rem"
              onClick={openScoreModal}
            >
              Score ({player.victoryPoints})
            </Button>
          </Stack>
        </Flex>
      </Container>
    </div>
  );
};
