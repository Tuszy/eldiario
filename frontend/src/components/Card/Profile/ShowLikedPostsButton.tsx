// React
import React, { FC } from "react";

// Router
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Tooltip, Typography } from "@mui/material";

// Icon
import { FavoriteBorder as Icon } from "@mui/icons-material";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

// Component
const ShowLikedPostsButton: FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  const navigateToOverview = () =>
    navigate(`/profile/${profile.address}/likes`);

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
      <Tooltip title={"Show posts user liked"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .icon": {
              fill: "#F00",
              background: "#F001",
            },
            "&:hover p": {
              color: "#F00",
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
            {profile.socialProfileStats?.likedPosts}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ShowLikedPostsButton;
