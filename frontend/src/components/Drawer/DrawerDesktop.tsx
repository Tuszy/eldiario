// React
import React, { FC } from "react";

// MUI
import { Drawer } from "@mui/material";

// Components
import DrawerContent from "./DrawerContent";

interface Props {
  width: number;
  setMobileOpen: (open: boolean) => void;
}

const DrawerDesktop: FC<Props> = ({ setMobileOpen, width }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: width,
        },
      }}
      open
    >
      <DrawerContent setMobileOpen={setMobileOpen} />
    </Drawer>
  );
};

export default DrawerDesktop;
