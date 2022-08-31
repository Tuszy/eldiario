// React
import React, { FC } from "react";

// MUI
import { Drawer } from "@mui/material";

// Components
import DrawerContent from "./DrawerContent";

interface Props {
  width: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const DrawerMobile: FC<Props> = ({ mobileOpen, setMobileOpen, width }) => {
  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: width,
        },
      }}
    >
      <DrawerContent setMobileOpen={setMobileOpen} />
    </Drawer>
  );
};

export default DrawerMobile;
