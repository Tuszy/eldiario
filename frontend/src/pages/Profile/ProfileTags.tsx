// React
import React, { FC } from "react";

// MUI
import { Box, Chip } from "@mui/material";

// Components
import ProfileSegment from "./ProfileSegment";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileTags: FC<Props> = ({ profile }) => {
  return (
    <ProfileSegment
      name="TAGS"
      available={Boolean(profile?.tags?.length ?? 0 > 0)}
      showDivider={true}
    >
      <Box
        sx={{
          display: "flex",
          gap: (theme) => theme.spacing(1),
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {profile?.tags?.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            sx={{ color: "black", mr: 1, ml: 1, minWidth: "150px" }}
          />
        ))}
      </Box>
    </ProfileSegment>
  );
};

export default ProfileTags;
