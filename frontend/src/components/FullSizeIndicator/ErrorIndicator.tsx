// React
import React, { FC } from "react";

// MUI
import { Box, Typography } from "@mui/material";

interface Props {
  error: React.ReactNode;
}

const ErrorIndicator: FC<Props> = ({ error }) => {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant={"h5"}
        sx={{
          color: "rgba(0,0,0,0.3)",
          maxWidth: "800px",
          wordBreak: "break-word",
        }}
      >
        {error}
      </Typography>
    </Box>
  );
};

export default ErrorIndicator;
