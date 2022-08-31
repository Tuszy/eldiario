// React
import React, { FC } from "react";

// Router
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Tooltip, Typography } from "@mui/material";

// Icon
import { ChatBubbleOutline as Icon } from "@mui/icons-material";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

// Component
const ShowPostsButton: FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  const navigateToOverview = () =>
    navigate(`/profile/${profile.address}/posts`);

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
      <Tooltip title={"Show posts"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .icon": {
              fill: "#00F",
              background: "#00F1",
            },
            "&:hover p": {
              color: "#00F",
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
            {profile.socialProfileStats?.posts}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ShowPostsButton;
