// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// MUI
import { Typography } from "@mui/material";

// Components
import PostCard from "../../components/Card/Post/PostCard";
import PagedListWithPost from "../../components/PagedList/PagedListWithPost";

// Helper
import _ from "lodash";
import { fetchSharesOfPost } from "../../utils/social-network-post";

// Types
import { SocialNetworkPost } from "../../types/SocialNetworkPost";

// Component Context
const ShareListContext = PagedListContext<SocialNetworkPost>();

// Component
const ShareList = () => {
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
        Shares
      </Typography>
      <PagedListWithPost
        context={ShareListContext}
        itemSize={200}
        itemComponent={PostCard}
        fetchPageWithItemKeys={fetchSharesOfPost}
        fetchItemData={getPost}
      />
    </>
  );
};

export default ShareList;
