// React
import React, { FC } from "react";

// MUI
import { Box, Backdrop, CircularProgress, Typography } from "@mui/material";

interface Props {
  open: boolean;
  text?: string;
}

const LoadingBackdrop: FC<Props> = ({ open, text }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 2,
        display: "flex",
        flexDirection: "column",
        userSelect: "none"
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {text && (
        <Box m={2}>
          <Typography variant="h5">{text}</Typography>
        </Box>
      )}
    </Backdrop>
  );
};

export default LoadingBackdrop;
