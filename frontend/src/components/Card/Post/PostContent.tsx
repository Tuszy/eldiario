// React
import React, { FC, useState, useContext, useRef, useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Crypto
import { ethers } from "ethers";

// Context
import CachedProfilesAndPostsContext from "../../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// MUI
import { Box, Typography } from "@mui/material";

// Components
import LoadingIndicator from "../../FullSizeIndicator/LoadingIndicator";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  post: SocialNetworkPost;
}

const PostContent: FC<Props> = React.memo(
  ({ post }) => {
    const isMounted = useRef(false);
    const { getProfile } = useContext(CachedProfilesAndPostsContext);
    const [content, setContent] = useState<React.ReactNode>(null);

    const initContent = async () => {
      if (!post) {
        setContent(null);
      } else {
        setContent(
          await replaceUserTagsWithUserLinks(post.content, getProfile)
        );
      }
    };

    useEffect(() => {
      if (!isMounted.current) isMounted.current = true;
      else return;

      initContent();
    }, [post]);

    return content === null ? (
      <Box
        sx={{
          color: "rgba(0,0,0,0.5)",
          userSelect: "none",
          width: "100%",
          border: "0.5px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          p: 0.5,
          flexGrow: "1",
          flexShrink: "1",
        }}
      >
        <LoadingIndicator />
      </Box>
    ) : (
      <Typography
        variant="body2"
        sx={{
          color: "rgba(0,0,0,0.5)",
          width: "100%",
          border: "0.5px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          p: 0.5,
          flexGrow: "1",
          flexShrink: "1",
          ...(post.content.length === 0
            ? {
                color: "rgba(0,0,0,0.25)",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : {}),
          wordBreak: "break-all",
          overflowY: "scroll",
        }}
      >
        {post.content.length === 0 ? "INVALID POST CONTENT" : content}
      </Typography>
    );
  },
  (prevProps, nextProps) => prevProps.post.address === nextProps.post.address
);

// Converts string with user tags to React.Node with user links
export const replaceUserTagsWithUserLinks = async (
  content: string,
  fetchProfile: (address: string) => Promise<null | SocialNetworkProfile>
): Promise<React.ReactNode> => {
  const possibleAddressMatches = Array.from(content.matchAll(/\{(.+?)\}/g));
  let contentParts = content.split(/\{.+?\}/);

  let newContent = [];
  for (let i = 0; i < possibleAddressMatches.length; i++) {
    newContent.push(contentParts[i]);
    const possibleAddress = possibleAddressMatches[i][1];
    if (ethers.utils.isAddress(possibleAddress)) {
      const profile = await fetchProfile(possibleAddress);
      if (profile?.name) {
        newContent.push(
          <Link
            to={`/profile/${possibleAddress}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            @{profile.name}
          </Link>
        );
        continue;
      }
    }
    newContent.push(possibleAddress);
  }
  newContent.push(contentParts[contentParts.length - 1]);

  return (
    <span>
      {newContent.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </span>
  );
};

export default PostContent;
