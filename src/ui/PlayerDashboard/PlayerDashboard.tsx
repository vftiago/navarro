import { Button, Container, Flex, Stack } from "@mantine/core";
import { ClickWidget } from "./ClickWidget";
import { TagWidget } from "./TagWidget";
import { PlayerHand } from "./PlayerHand";
import { useGameState } from "../../context/useGameState";
import { useCallback } from "react";
import { GamePhase } from "../../state/gameReducer";

export const PlayerDashboard = ({
  openDeckModal,
  openDiscardModal,
  openTrashModal,
  openScoreModal,
}: {
  openDeckModal: () => void;
  openDiscardModal: () => void;
  openTrashModal: () => void;
  openScoreModal: () => void;
}) => {
  const {
    dispatch,
    gameState: { player, currentPhase, currentTurn, tick },
  } = useGameState();

  const onClickEndTurn = useCallback(() => {
    if (currentPhase !== GamePhase.Main) {
      return;
    }

    dispatch({ type: GamePhase.Discard });
  }, [currentPhase, dispatch]);

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

          <div className="flex-1 flex justify-center">
            <PlayerHand />
          </div>

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
