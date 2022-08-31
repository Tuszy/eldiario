// React
import React from "react";

// MUI
import { Typography } from "@mui/material";

// Icons
import { AutoStories as LogoIcon } from "@mui/icons-material";

const Logo = () => {
  return (
    <Typography
      noWrap
      component="div"
      sx={{
        fontFamily: "Lobster",
        fontSize: "2rem",
        fontWeight: "900",
        pl: 1,
        pr: 1,
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LogoIcon sx={{fontSize: "2.4rem", mb: -0.25, mr: 1.5}}/>
      el diario
    </Typography>
  );
};

export default Logo;
