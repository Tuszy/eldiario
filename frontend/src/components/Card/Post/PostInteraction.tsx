// React
import React, { FC } from "react";

// MUI
import { Box } from "@mui/material";

// Components
import CommentPostButton from "./CommentPostButton";
import SharePostButton from "./SharePostButton";
import LikePostButton from "./LikePostButton";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  post: SocialNetworkPost;
  author: SocialNetworkProfile;
  refetch: () => void;
}

const PostInteraction: FC<Props> = ({ post, author, refetch }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: "0",
        flexShrink: "0",
        gap: (theme) => theme.spacing(1),
      }}
    >
      <CommentPostButton post={post} author={author} onChange={refetch}/>
      <SharePostButton post={post} author={author} onChange={refetch}/>
      <LikePostButton post={post} onChange={refetch} />
    </Box>
  );
};

export default PostInteraction;
