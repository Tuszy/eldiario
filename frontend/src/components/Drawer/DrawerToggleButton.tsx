// React
import React, { FC } from "react";

// MUI
import { IconButton } from "@mui/material";

// Icons
import { Menu as MenuIcon } from "@mui/icons-material";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const DrawerToggleButton: FC<Props> = ({ onClick }) => {
  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={onClick}
      sx={{ display: { sm: "none" } }}
    >
      <MenuIcon />
    </IconButton>
  );
};

export default DrawerToggleButton;
