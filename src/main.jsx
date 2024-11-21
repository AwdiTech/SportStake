import { createRoot } from "react-dom/client";
import ThemedApp from "./ThemedApp";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode> // Temporarily turned off strict mode to prevent multiple API calls
  <ThemedApp />
  // </StrictMode>
);
