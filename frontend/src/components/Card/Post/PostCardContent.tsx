// React
import React, { FC } from "react";

// Crypto
import { ethers } from "ethers";

// MUI
import { Box, Card } from "@mui/material";

// Components
import ProfileName from "../ProfileName";
import ProfileAvatar from "../ProfileAvatar";
import PostContent from "./PostContent";
import PostInteraction from "./PostInteraction";

// Constants
import { SocialNetworkPostType } from "../../../contracts/SocialNetworkConstants";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";
import { Link } from "react-router-dom";

interface Props {
  post: SocialNetworkPost;
  author: SocialNetworkProfile;
  refetch: () => void;
  hideInteraction?: boolean;
}

const PostCardContent: FC<Props> = ({
  post,
  author,
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
        background: post.content.length === 0 ? "rgba(255,0,0,0.2)" : undefined,
        // transition: "0.15s ease-in-out",
        // cursor: "pointer",
        // "&:hover": {
        //   background: "#eee",
        // },
      }}
    >
      <ProfileAvatar profile={author} />

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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            flexGrow: "0",
            flexShrink: "0",
            fontSize: "0.9rem",
            color: "rgba(0,0,0,0.6)",
          }}
        >
          <ProfileName profile={author} />
          {post.type === SocialNetworkPostType.STANDALONE && (
            <Box>&nbsp;created&nbsp;</Box>
          )}
          {post.type === SocialNetworkPostType.COMMENT && (
            <Box>&nbsp;commented&nbsp;</Box>
          )}
          {post.type === SocialNetworkPostType.SHARE && (
            <Box>&nbsp;shared&nbsp;</Box>
          )}
          <Link
            to={`/post/${
              post.referencedPost !== ethers.constants.AddressZero
                ? post.referencedPost
                : post.address
            }`}
            style={{ textDecoration: "none" }}
          >
            Post
          </Link>
        </Box>
        <PostContent post={post} />
        {!hideInteraction && (
          <PostInteraction post={post} author={author} refetch={refetch} />
        )}
      </Box>
    </Card>
  );
};

export default PostCardContent;
