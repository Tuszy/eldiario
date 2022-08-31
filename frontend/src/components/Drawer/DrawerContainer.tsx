// React
import React, { FC } from "react";

// MUI
import { Box } from "@mui/material";

// Components
import DrawerMobile from "./DrawerMobile";
import DrawerDesktop from "./DrawerDesktop";

interface Props {
  width: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const DrawerContainer: FC<Props> = ({ width, mobileOpen, setMobileOpen }) => {
  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      <DrawerMobile
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        width={width}
      />
      <DrawerDesktop setMobileOpen={setMobileOpen} width={width} />
    </Box>
  );
};

export default DrawerContainer;
