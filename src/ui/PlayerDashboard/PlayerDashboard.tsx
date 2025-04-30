import { Button, Container, Flex, Stack } from "@mantine/core";
import { ClickWidget } from "./ClickWidget";
import { TagWidget } from "./TagWidget";
import { PlayerHand } from "./PlayerHand";
import { useThunk } from "../../context/useThunk";
import { useGameState } from "../../context/useGameState";
import {
  getCurrentTurn,
  getPlayerDeck,
  getPlayerDiscardPile,
  getPlayerTags,
  getPlayerTrashPile,
  getPlayerVictoryPoints,
  getTurnCurrentPhase,
  getTurnRemainingClicks,
} from "../../state/selectors";
import { GamePhase } from "../../state/types";
import { executeDiscardPhase } from "../../state/thunks";

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
  const { gameState } = useGameState();
  const dispatchThunk = useThunk();

  const turnCurrentPhase = getTurnCurrentPhase(gameState);
  const currentTurn = getCurrentTurn(gameState);
  const playerDeck = getPlayerDeck(gameState);
  const playerDiscardPile = getPlayerDiscardPile(gameState);
  const playerTrashPile = getPlayerTrashPile(gameState);
  const playerVictoryPoints = getPlayerVictoryPoints(gameState);
  const playerTags = getPlayerTags(gameState);
  const turnRemainingClicks = getTurnRemainingClicks(gameState);

  const handleEndTurn = () => {
    if (turnCurrentPhase !== GamePhase.Main) {
      return;
    }

    dispatchThunk(executeDiscardPhase());
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <Container fluid maw={1620} p="lg">
        <Flex className="justify-between items-end">
          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={openDeckModal}>
              Deck ({playerDeck.length})
            </Button>
            <ClickWidget turnRemainingClicks={turnRemainingClicks} />
            <TagWidget tagCount={playerTags} />
          </Stack>

          <div className="flex-1 flex justify-center">
            <PlayerHand />
          </div>

          <Stack className="flex-col-reverse" w="10rem">
            <Button size="lg" variant="gradient" onClick={handleEndTurn}>
              End turn ({currentTurn})
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
