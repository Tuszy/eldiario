// React
import React, { FC } from "react";

// MUI
import { Box } from "@mui/material";

// Components
import ProfileImageWithName from "./ProfileImageWithName";
import ProfileRegistrationStatus from "./ProfileRegistrationStatus";
import ProfileBackgroundImage from "./ProfileBackgroundImage";
import ProfileSubscribeButton from "./ProfileSubscribeButton";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
  refetch: () => void;
}

// Component
const ProfileHeader: FC<Props> = ({ profile, refetch }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "256px",
        flexShrink: "0",
        flexGrow: "0",
        pt: 4,
      }}
    >
      <ProfileSubscribeButton profile={profile} refetch={refetch} />
      <ProfileImageWithName profile={profile} />
      <ProfileBackgroundImage profile={profile} />
      <ProfileRegistrationStatus profile={profile} />
    </Box>
  );
};

export default ProfileHeader;
