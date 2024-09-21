import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import 'remixicon/fonts/remixicon.css'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/components/CodeEditor/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
