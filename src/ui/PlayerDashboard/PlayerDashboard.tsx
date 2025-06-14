import { Button, Container, Flex, Stack } from "@mantine/core";
import { ClickWidget } from "./ClickWidget";
import { TagWidget } from "./TagWidget";
import { PlayerHand } from "./PlayerHand";
import { useGameState } from "../../context/useGameState";
import { useCallback } from "react";
import { TurnPhase } from "../../state/reducers/turnReducer";
import { useThunk } from "../../context/useThunk";
import { startEndPhase } from "../../state/thunks";

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
    gameState: { playerState, turnState },
  } = useGameState();

  const dispatchThunk = useThunk();

  const {
    playerDeck,
    playerTags,
    playerDiscardPile,
    playerTrashPile,
    playerVictoryPoints,
  } = playerState;
  const { turnRemainingClicks, turnCurrentPhase, turnNumber } = turnState;

  const onClickEndTurn = useCallback(() => {
    if (turnCurrentPhase !== TurnPhase.Main) {
      return;
    }

    dispatchThunk(startEndPhase());
  }, [dispatchThunk, turnCurrentPhase]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <Container fluid maw={1620} p="lg">
        <Flex className="justify-between items-end">
          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({playerDeck.length})
            </Button>
            <ClickWidget remainingClicks={turnRemainingClicks} />
            <TagWidget tagCount={playerTags} />
          </Stack>

          <div className="flex-1 flex justify-center">
            <PlayerHand />
          </div>

          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={onClickEndTurn}>
              End turn ({turnNumber})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openDiscardModal}
            >
              Discard ({playerDiscardPile.length})
            </Button>
            <Button
              className="self-end"
              size="sm"
              variant="gradient"
              w="8rem"
              onClick={openTrashModal}
            >
              Trash ({playerTrashPile.length})
            </Button>
            <Button
              className="self-end"
              color="yellow"
              size="sm"
              w="8rem"
              onClick={openScoreModal}
            >
              Score ({playerVictoryPoints})
            </Button>
          </Stack>
        </Flex>
      </Container>
    </div>
  );
};
