import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC0CB",
    },
    secondary: {
      main: "#fff5ee",
      contrastText: "rgba(0,0,0,0.65)",
    }
  },
});

export default theme;
