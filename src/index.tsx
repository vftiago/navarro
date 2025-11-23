import { createTheme, DEFAULT_THEME, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const theme = createTheme({
  colors: {
    dark: [
      "#eeeeee",
      DEFAULT_THEME.colors.dark[1],
      DEFAULT_THEME.colors.dark[2],
      DEFAULT_THEME.colors.dark[3],
      DEFAULT_THEME.colors.dark[4],
      DEFAULT_THEME.colors.dark[5],
      DEFAULT_THEME.colors.dark[6],
      "#090909",
      DEFAULT_THEME.colors.dark[8],
      DEFAULT_THEME.colors.dark[9],
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
