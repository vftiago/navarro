import { Button, Container, Flex, Stack } from "@mantine/core";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useThunk } from "../../state/hooks";
import { startEndPhase } from "../../state/phases";
import { useGameStore } from "../../state/store";
import { TurnPhase } from "../../state/turn";
import { ClickWidget } from "./ClickWidget";
import { PlayerHand } from "./PlayerHand";
import { TagWidget } from "./TagWidget";

export const PlayerDashboard = ({
  openDeckModal,
  openDiscardModal,
  openScoreModal,
  openTrashModal,
}: {
  openDeckModal: () => void;
  openDiscardModal: () => void;
  openScoreModal: () => void;
  openTrashModal: () => void;
}) => {
  const {
    playerDeckLength,
    playerDiscardPileLength,
    playerTags,
    playerTrashPileLength,
    playerVictoryPoints,
    turnCurrentPhase,
    turnNumber,
    turnRemainingClicks,
  } = useGameStore(
    useShallow((state) => ({
      playerDeckLength: state.playerState.playerDeck.length,
      playerDiscardPileLength: state.playerState.playerDiscardPile.length,
      playerTags: state.playerState.playerTags,
      playerTrashPileLength: state.playerState.playerTrashPile.length,
      playerVictoryPoints: state.playerState.playerVictoryPoints,
      turnCurrentPhase: state.turnState.turnCurrentPhase,
      turnNumber: state.turnState.turnNumber,
      turnRemainingClicks: state.turnState.turnRemainingClicks,
    })),
  );

  const dispatchThunk = useThunk();

  const onClickEndTurn = useCallback(() => {
    if (turnCurrentPhase !== TurnPhase.Main) {
      return;
    }

    dispatchThunk(startEndPhase());
  }, [dispatchThunk, turnCurrentPhase]);

  return (
    <Container
      fluid
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-10"
      maw={1620}
      p="xs"
    >
      <Flex className="justify-between items-end">
        <Stack className="pointer-events-auto flex-col-reverse" w="10rem">
          <Button size="lg" variant="gradient" onClick={openDeckModal}>
            Deck ({playerDeckLength})
          </Button>
          <ClickWidget remainingClicks={turnRemainingClicks} />
          <TagWidget tagCount={playerTags} />
        </Stack>

        <div className="flex-1 flex justify-center">
          <PlayerHand />
        </div>

        <Stack className="pointer-events-auto flex-col-reverse" w="10rem">
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
            Discard ({playerDiscardPileLength})
          </Button>
          <Button
            className="self-end"
            size="sm"
            variant="gradient"
            w="8rem"
            onClick={openTrashModal}
          >
            Trash ({playerTrashPileLength})
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
  );
};
