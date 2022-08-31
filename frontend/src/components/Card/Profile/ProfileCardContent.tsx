// React
import React, { FC } from "react";

// MUI
import { Box, Card } from "@mui/material";

// Components
import ProfileName from "../ProfileName";
import ProfileAvatar from "../ProfileAvatar";
import ProfileDescription from "./ProfileDescription";
import ProfileInteraction from "./ProfileInteraction";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
  refetch: () => void;
  hideInteraction?: boolean;
}

const ProfileCardContent: FC<Props> = ({
  profile,
  refetch,
  hideInteraction,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        p: "1rem",
        gap: "1rem",
      }}
    >
      <ProfileAvatar profile={profile} />

      <Box
        sx={{
          flexGrow: "1",
          flexShrink: "1",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: (theme) => theme.spacing(0.5),
        }}
      >
        <ProfileName profile={profile} />
        <ProfileDescription profile={profile} />
        {!hideInteraction && (
          <ProfileInteraction profile={profile} refetch={refetch} />
        )}
      </Box>
    </Card>
  );
};

export default ProfileCardContent;
