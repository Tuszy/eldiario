// React
import React, { FC, useRef, useContext, useEffect, useState } from "react";

// Context
import CachedProfilesAndPostsContext from "../../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// MUI
import { Box, Skeleton } from "@mui/material";

// Components
import PostCardContent from "./PostCardContent";

// Helper
import _ from "lodash";

// Types
import type { SocialNetworkPost } from "../../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";
import type { PagedListItemComponentProps } from "../../PagedList/PagedList.d";

const PostCard: FC<PagedListItemComponentProps<SocialNetworkPost>> = React.memo(
  ({ index, sx, loading, value: post, refetch }) => {
    const isMounted = useRef(false);
    const { getProfile, getProfileFromCache } = useContext(
      CachedProfilesAndPostsContext
    );
    const [author, setAuthor] = useState<null | SocialNetworkProfile>(
      getProfileFromCache(post?.author ?? "") ?? null
    );

    const initAuthor = async () => {
      if (author) return; // loaded from cache

      if (!post) setAuthor(null);
      else setAuthor(await getProfile(post.author));
    };

    useEffect(() => {
      if (!isMounted.current) isMounted.current = true;
      else return;

      initAuthor();
    }, [post]);

    return (
      <Box p={1} pr={2} pl={2} sx={sx}>
        {loading || !post || !author ? (
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        ) : (
          <PostCardContent post={post} author={author} refetch={refetch} />
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => _.isEqual(prevProps.value, nextProps.value)
);

export default PostCard;
