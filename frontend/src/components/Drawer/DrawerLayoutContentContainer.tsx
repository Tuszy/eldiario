// React
import React, { FC } from "react";

// MUI
import { Box, Toolbar } from "@mui/material";

interface Props {
  width: number;
  children: React.ReactNode;
}

const DrawerLayoutContentContainer: FC<Props> = ({ children, width }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${width}px)` },
        color: (theme) => theme.palette.secondary.contrastText,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Toolbar sx={{ display: { sm: "none" } }} />
      {children}
    </Box>
  );
};

export default DrawerLayoutContentContainer;
