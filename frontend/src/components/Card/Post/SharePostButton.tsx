// React
import React, { FC, useContext, useEffect, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Context
import EthersContext from "../../../contexts/EthersContext/EthersContext";
import CachedProfilesAndPostsContext from "../../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// Toast
import { toast } from "react-toastify";

// MUI
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";

// Icon
import { Repeat as ShareIcon } from "@mui/icons-material";

// Components
import SharePostDialog from "../../Dialog/SharePostDialog";

// Contract Functions
import { getUserTags, sharePost } from "../../../utils/social-network-post";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  post: SocialNetworkPost;
  author: SocialNetworkProfile;
  onChange: () => void;
}

// Component
const SharePostButton: FC<Props> = ({ post, author, onChange }) => {
  const navigate = useNavigate();
  const { provider, universalProfile } = useContext(EthersContext);
  const { getProfile } = useContext(CachedProfilesAndPostsContext);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authenticated =
    provider &&
    universalProfile?.socialNetworkProfileDataContract &&
    universalProfile?.socialNetworkProfileDataERC725Contract &&
    universalProfile?.socialProfileStats;

  const share = async (content: string) => {
    if (!authenticated) return;
    if (content.length === 0) return;

    setLoading(true);
    const promise = sharePost(provider, content, post.address);
    toast.promise(promise, {
      pending: `Sharing post...`,
      success: `Successfully shared post...`,
      error: `Sharing post failed. (Probably no LYXe available.)`,
    });
    try {
      await promise;
      await onChange();
      const taggedProfileAddresses = await getUserTags(content);
      for (const profileAddress of taggedProfileAddresses) {
        await getProfile(profileAddress, true);
      }
    } catch (e) {
      console.error(e);
    }
    setShowDialog(false);
    setLoading(false);
  };

  const navigateToShareOverview = () =>
    navigate(`/post/${post.address}/shares`);

  let label: string | React.ReactNode = post.shares;
  if (loading || showDialog) {
    label = (
      <CircularProgress
        size={9}
        sx={{
          mr: (theme) => theme.spacing(1),
          color: "rgba(0,0,0,0.5)",
        }}
      />
    );
  }

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
      <Tooltip title={!authenticated ? "Show shares" : "Share"}>
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
          onClick={
            authenticated ? () => setShowDialog(true) : navigateToShareOverview
          }
        >
          <ShareIcon
            className={"icon"}
            sx={{
              fill: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              p: "4px",
              pt: "4px",
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "rgba(0,0,0,0.6)", mb: "-2px", userSelect: "none" }}
            gutterBottom={false}
          >
            {label}
          </Typography>
        </Box>
      </Tooltip>
      {showDialog && (
        <SharePostDialog
          author={author}
          post={post}
          onShare={share}
          onClose={() => setShowDialog(false)}
          disabled={loading}
        />
      )}
    </Box>
  );
};

export default SharePostButton;
