// React
import React from "react";
import ReactDOM from "react-dom/client";

// Routing
import { BrowserRouter } from "react-router-dom";

// Theme / Styling
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "react-toastify/dist/ReactToastify.css";

// 3rd Party
import { ToastContainer } from "react-toastify";

// Custom Contexts
import EthersContextProvider from "./contexts/EthersContext/EthersContextProvider";
import CachedProfilesAndPostsContextProvider from "./contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContextProvider";

// Custom Components
import App from "./App";

// Rendering
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <CachedProfilesAndPostsContextProvider>
        <EthersContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ToastContainer
            style={{ cursor: "default" }}
            autoClose={15000}
            theme="colored"
            closeOnClick={false}
            pauseOnFocusLoss={false}
          />
        </EthersContextProvider>
      </CachedProfilesAndPostsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
