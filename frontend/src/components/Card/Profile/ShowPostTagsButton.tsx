// React
import React, { FC } from "react";

// Router
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Tooltip, Typography } from "@mui/material";

// Icon
import { AlternateEmail as Icon } from "@mui/icons-material";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

// Component
const ShowPostTagsButton: FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  const navigateToOverview = () =>
    navigate(`/profile/${profile.address}/tags`);

  return (
    <Box
      sx={{
        flex: "1",
        maxWidth: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Tooltip title={"Show posts user was tagged in"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .icon": {
              fill: "#0A0",
              background: "#0A01",
            },
            "&:hover p": {
              color: "#0A0",
            },
            gap: (theme) => theme.spacing(0.5),
          }}
          onClick={navigateToOverview}
        >
          <Icon
            className={"icon"}
            sx={{
              fill: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              p: "4px",
              pt: "6px",
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "rgba(0,0,0,0.6)", mb: "-2px", userSelect: "none" }}
            gutterBottom={false}
          >
            {profile.socialProfileStats?.postTags}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ShowPostTagsButton;
