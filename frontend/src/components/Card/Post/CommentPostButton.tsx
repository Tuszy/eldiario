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
import { Reply as CommentIcon } from "@mui/icons-material";

// Components
import CommentPostDialog from "../../Dialog/CommentPostDialog";

// Contract Functions
import { commentPost, getUserTags } from "../../../utils/social-network-post";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  post: SocialNetworkPost;
  author: SocialNetworkProfile;
  onChange: () => void;
}

// Component
const CommentPostButton: FC<Props> = ({ post, author, onChange }) => {
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

  const comment = async (content: string) => {
    if (!authenticated) return;
    if (content.length === 0) return;

    setLoading(true);
    const promise = commentPost(provider, content, post.address);
    toast.promise(promise, {
      pending: `Commenting post...`,
      success: `Successfully commented post...`,
      error: `Commenting post failed. (Probably no LYXe available.)`,
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

  const navigateToCommentOverview = () =>
    navigate(`/post/${post.address}/comments`);

  let label: string | React.ReactNode = post.comments;
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
      <Tooltip title={!authenticated ? "Show comments" : "Comment"}>
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
          onClick={
            authenticated
              ? () => setShowDialog(true)
              : navigateToCommentOverview
          }
        >
          <CommentIcon
            className={"icon"}
            sx={{
              fill: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              p: "4px",
              pt: "2px",
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
        <CommentPostDialog
          author={author}
          post={post}
          onComment={comment}
          onClose={() => setShowDialog(false)}
          disabled={loading}
        />
      )}
    </Box>
  );
};

export default CommentPostButton;
