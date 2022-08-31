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
import { fetchPostTagsOfProfile } from "../../utils/social-network-profile-data";

// Types
import { SocialNetworkPost } from "../../types/SocialNetworkPost";

// Component Context
const PostTagListContext = PagedListContext<SocialNetworkPost>();

// Component
const PostTagList = () => {
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
        Tagged In Posts
      </Typography>
      <PagedListWithProfile
        context={PostTagListContext}
        itemSize={200}
        itemComponent={PostCard}
        fetchPageWithItemKeys={fetchPostTagsOfProfile}
        fetchItemData={getPost}
      />
    </>
  );
};

export default PostTagList;
