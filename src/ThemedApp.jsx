import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1d3557", // Dark Blue (for buttons and headers)
    },
    secondary: {
      main: "#e63946", // Vibrant Red (for accents and call-to-action elements)
    },
    background: {
      default: "#f1faee", // Light Off-white background (for general background)
      paper: "#a8dadc", // Soft Aqua (for cards or form backgrounds)
    },
    success: {
      main: "#2a9d8f", // Teal Green (for positive actions like successful login)
    },
    error: {
      main: "#e76f51", // Coral (for error messages)
    },
    text: {
      primary: "#1d3557", // Dark Blue (for main text color)
      secondary: "#457b9d", // Muted Blue (for secondary text)
    },
  },
});

function ThemedApp() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default ThemedApp;
