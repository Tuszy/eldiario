// React
import React, { FC } from "react";

// MUI
import { Box, Chip, Link as URLLink } from "@mui/material";

// Icon
import { Link as LinkIcon } from "@mui/icons-material";

// Components
import ProfileSegment from "./ProfileSegment";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileLinks: FC<Props> = ({ profile }) => {
  return (
    <ProfileSegment
      name="LINKS"
      available={Boolean(profile?.links?.length ?? 0 > 0)}
      showDivider={false}
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
        {profile?.links?.map((link) => (
          <URLLink
            key={link.url}
            href={link.url}
            target="_blank"
            sx={{ color: "black", mr: 1, ml: 1 }}
            underline={"none"}
          >
            <Chip
              icon={<LinkIcon sx={{ fill: "rgba(0,0,0,0.3)" }} />}
              label={link.title.toUpperCase()}
              sx={{
                cursor: "pointer",
                transition: "0.1s ease-in-out",
                "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
                minWidth: "150px",
              }}
            />
          </URLLink>
        ))}
      </Box>
    </ProfileSegment>
  );
};

export default ProfileLinks;
