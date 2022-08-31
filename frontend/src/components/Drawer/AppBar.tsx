// React
import React, { FC } from "react";

// MUI
import { AppBar as MuiAppBar, Slide, Toolbar } from "@mui/material";

// Custom Components
import Logo from "./Logo";
import DrawerToggleButton from "./DrawerToggleButton";

interface Props {
  width: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const AppBar: FC<Props> = ({ width, mobileOpen, setMobileOpen }) => {
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${width}px)` },
        ml: { sm: `${width}px` },
        display: { sm: "none" },
        bgcolor: "white",
        color: "black",
      }}
    >
      <Toolbar>
        <Slide
          direction="right"
          in={!mobileOpen}
          appear={false}
          mountOnEnter
          unmountOnExit
        >
          <div style={{ display: "flex" }}>
            <DrawerToggleButton onClick={handleDrawerToggle} />
            <Logo />
          </div>
        </Slide>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
