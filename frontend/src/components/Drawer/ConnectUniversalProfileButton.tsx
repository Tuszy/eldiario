// React
import React, { FC, useContext } from "react";

// Icons
import { Fingerprint as FingerprintIcon } from "@mui/icons-material";

// Contexts
import EthersContext from "../../contexts/EthersContext/EthersContext";

// Custom Component
import LoadingButton from "../Loading/LoadingButton";

// MUI Types
import type { SxProps, Theme } from "@mui/material";

interface Props {
  sx?: SxProps<Theme> | undefined;
}

const ConnectUniversalProfileButton: FC<Props> = ({ sx }) => {
  const { connectUniversalProfile, loading, universalProfile } =
    useContext(EthersContext);

  return (
    <LoadingButton
      loading={
        loading ||
        (!!universalProfile &&
          !universalProfile?.socialNetworkProfileDataContract)
      }
      loadingText="Waiting..."
      sx={{
        width: "100%",
        pt: 1,
        pb: 1,
        bgcolor: "black",
        color: (theme) => theme.palette.secondary.main,
        "&:hover": {
          bgcolor: "rgba(0,0,0,0.7)",
        },
        fontSize: "0.75rem",
        ...(sx ?? {}),
      }}
      onClick={connectUniversalProfile}
      buttonProps={{ variant: "contained" }}
    >
      <FingerprintIcon sx={{ mr: 0.75 }} />{" "}
      {universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}
    </LoadingButton>
  );
};

export default ConnectUniversalProfileButton;
