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
import { fetchLikedPostsOfProfile } from "../../utils/social-network-profile-data";

// Types
import { SocialNetworkPost } from "../../types/SocialNetworkPost";

// Component Context
const PostLikeListContext = PagedListContext<SocialNetworkPost>();

// Component
const PostLikeList = () => {
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
        Liked Posts
      </Typography>
      <PagedListWithProfile
        context={PostLikeListContext}
        itemSize={200}
        itemComponent={PostCard}
        fetchPageWithItemKeys={fetchLikedPostsOfProfile}
        fetchItemData={getPost}
      />
    </>
  );
};

export default PostLikeList;
