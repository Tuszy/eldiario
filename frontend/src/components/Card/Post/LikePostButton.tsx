// React
import React, { FC, useContext, useEffect, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Context
import EthersContext from "../../../contexts/EthersContext/EthersContext";

// Toast
import { toast } from "react-toastify";

// MUI
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";

// Icon
import {
  Favorite as UnlikeIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";

// Contract
import { SocialNetwork } from "../../../utils/social-network";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";

interface Props {
  post: SocialNetworkPost;
  onChange: () => void;
}

// Component
const LikePostButton: FC<Props> = ({ post, onChange }) => {
  const navigate = useNavigate();
  const { provider, universalProfile } = useContext(EthersContext);
  const [hasLiked, setHasLiked] = useState<null | boolean>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const authenticated =
    provider &&
    universalProfile?.socialNetworkProfileDataContract &&
    universalProfile?.socialNetworkProfileDataERC725Contract &&
    universalProfile?.socialProfileStats &&
    post.author.toLowerCase() !== universalProfile?.address.toLowerCase();

  const fetchLikeStatus = async () => {
    if (!authenticated) return;
    try {
      setHasLiked(
        await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
          post.address
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [universalProfile]);

  const like = async () => {
    if (!authenticated) return;
    if (
      await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
        post.address
      )
    ) {
      setHasLiked(true);
      return;
    }

    const tx = await SocialNetwork.connect(provider.getSigner()).likePost(
      post.address
    );
    await tx.wait();
    setHasLiked(true);
    await onChange();
  };

  const unlike = async () => {
    if (!authenticated) return;
    if (
      !(await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
        post.address
      ))
    ) {
      setHasLiked(false);
      return;
    }

    const tx = await SocialNetwork.connect(provider.getSigner()).unlikePost(
      post.address
    );
    await tx.wait();
    setHasLiked(false);
    await onChange();
  };

  const toggleLike = async () => {
    setLoading(true);

    let promise: Promise<any>;
    if (hasLiked) {
      promise = unlike();
      toast.promise(promise, {
        pending: `Unliking post...`,
        success: `Successfully unliked post...`,
        error: `Unliking post failed. (Probably no LYXe available.)`,
      });
    } else {
      promise = like();
      toast.promise(promise, {
        pending: `Liking post...`,
        success: `Successfully liked post...`,
        error: `Liking post failed. (Probably no LYXe available.)`,
      });
    }
    try {
      await promise;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLikeOverview = () => navigate(`/post/${post.address}/likes`);

  let label: string | React.ReactNode = post.likes;
  if (loading) {
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

  const Icon = hasLiked ? UnlikeIcon : LikeIcon;

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
      <Tooltip
        title={
          !authenticated
            ? "Show profiles who liked the post"
            : hasLiked
            ? "Unlike"
            : "Like"
        }
      >
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
          onClick={authenticated ? toggleLike : navigateToLikeOverview}
        >
          <Icon
            className={"icon"}
            sx={{ fill: "rgba(0,0,0,0.6)", borderRadius: "50%", p: "4px" }}
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
    </Box>
  );
};

export default LikePostButton;
