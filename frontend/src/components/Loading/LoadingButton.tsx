// React
import React, { FC } from "react";

// MUI
import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  Theme,
} from "@mui/material";

interface Props {
  children: React.ReactNode;
  loading: boolean;
  loadingText: string | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme> | undefined;
  buttonProps?: ButtonProps | undefined;
}

const LoadingButton: FC<Props> = ({
  children,
  loading,
  onClick,
  sx,
  loadingText,
  buttonProps,
}) => {
  return (
    <Button
      disabled={loading}
      {...(buttonProps ?? {})}
      onClick={onClick}
      sx={sx}
    >
      {loading ? (
        <>
          <CircularProgress
            size="0.75rem"
            thickness={5}
            sx={{ mr: 0.75, color: "rgba(0,0,0,0.25)" }}
          />
          {loadingText}
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default LoadingButton;
