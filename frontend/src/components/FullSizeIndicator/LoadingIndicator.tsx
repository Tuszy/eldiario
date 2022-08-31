// React
import React, { FC } from "react";

// MUI
import { Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  text?: string;
}

const LoadingIndicator: FC<Props> = ({ text }) => {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "rgba(0,0,0,0.25)" }} />
      <Typography
        variant={"h5"}
        sx={{
          color: "rgba(0,0,0,0.3)",
          maxWidth: "800px",
          wordBreak: "break-word",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
