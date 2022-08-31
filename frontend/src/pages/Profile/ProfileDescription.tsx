// React
import React, { FC } from "react";

// MUI
import { Typography } from "@mui/material";

// Components
import ProfileSegment from "./ProfileSegment";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileDescription: FC<Props> = ({ profile }) => {
  return (
    <ProfileSegment
      name="DESCRIPTION"
      available={Boolean(profile?.description?.length ?? 0 > 0)}
      showDivider={true}
    >
      <Typography variant="body1">{profile?.description}</Typography>
    </ProfileSegment>
  );
};

export default ProfileDescription;
