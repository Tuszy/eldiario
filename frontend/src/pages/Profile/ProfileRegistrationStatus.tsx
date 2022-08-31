// React
import React, { FC } from "react";

// MUI
import { Chip } from "@mui/material";

// Icon
import {
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileRegistrationStatus: FC<Props> = ({ profile }) => {
  return (
    <Chip
      size="small"
      icon={
        profile?.socialProfileStats ? (
          <SentimentVerySatisfied />
        ) : (
          <SentimentVeryDissatisfied />
        )
      }
      label={profile?.socialProfileStats ? "REGISTERED" : "UNREGISTERED"}
      color={profile?.socialProfileStats ? "success" : "error"}
      sx={{ zIndex: 1, mt: 1 }}
    />
  );
};

export default ProfileRegistrationStatus;
