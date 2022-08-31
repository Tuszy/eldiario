// React
import React, { FC } from "react";

// MUI
import { Box } from "@mui/material";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileBackgroundImage: FC<Props> = ({ profile }) => {
  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "0",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.25)",
        boxShadow: "0px 0px 2px 0px black",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        overflow: "hidden",
      }}
    >
      {profile?.backgroundImage[0]?.url && (
        <Box
          onDragStart={preventDefault}
          onDrop={preventDefault}
          component="img"
          alt="Background Image"
          src={profile?.backgroundImage[0]?.url}
          sx={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </Box>
  );
};

export default ProfileBackgroundImage;
