import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemedApp from "./ThemedApp";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>
);
