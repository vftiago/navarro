import { Button, Stack, Title } from "@mantine/core";

type MainMenuProps = {
  onStartGame: () => void;
};

export const MainMenu = ({ onStartGame }: MainMenuProps) => {
  return (
    <Stack align="center" className="h-screen" gap="xl" justify="center">
      <Title className="font-orbitron" order={1} size="3rem">
        Runner
      </Title>
      <Button color="gray" size="lg" variant="filled" onClick={onStartGame}>
        New Game
      </Button>
    </Stack>
  );
};
