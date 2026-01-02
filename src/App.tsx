import { useCallback, useState } from "react";
import { Game } from "./Game";
import { MainMenu } from "./MainMenu";

type Screen = "menu" | "game";

export const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("game");

  const handleStartGame = useCallback(() => {
    setCurrentScreen("game");
  }, []);

  if (currentScreen === "menu") {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  return <Game />;
};

export default App;
