// React
import React, { FC } from "react";

// Router
import { Link } from "react-router-dom";

// MUI
import { Box, Typography } from "@mui/material";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

const ProfileName: FC<Props> = React.memo(
  ({ profile }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexShrink: "1",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "rgba(0,0,0,0.6)",
            userSelect: "none",
            fontSize: "0.9rem"
          }}
        >
          {profile.name}#{profile.address.substring(2, 6)}
        </Typography>
      </Box>
    );
  },
  (prevProps, nextProps) =>
    prevProps.profile.address === nextProps.profile.address
);

export default ProfileName;
