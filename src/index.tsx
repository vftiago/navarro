import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { GameStateContextProvider } from "./context/GameStateContextProvider";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <GameStateContextProvider>
        <App />
      </GameStateContextProvider>
    </MantineProvider>
  </React.StrictMode>,
);
