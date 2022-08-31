// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// MUI
import { Typography } from "@mui/material";

// Components
import PostCard from "../../components/Card/Post/PostCard";
import PagedListWithProfile from "../../components/PagedList/PagedListWithProfile";

// Helper
import _ from "lodash";
import { fetchPostsOfProfile } from "../../utils/social-network-profile-data";

// Types
import { SocialNetworkPost } from "../../types/SocialNetworkPost";

// Component Context
const PostListContext = PagedListContext<SocialNetworkPost>();

// Component
const PostList = () => {
  const { getPost } = useContext(CachedProfilesAndPostsContext);

  return (
    <>
      <Typography
        variant={"h6"}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        Created Posts
      </Typography>
      <PagedListWithProfile
        context={PostListContext}
        itemSize={200}
        itemComponent={PostCard}
        fetchPageWithItemKeys={fetchPostsOfProfile}
        fetchItemData={getPost}
      />
    </>
  );
};

export default PostList;
