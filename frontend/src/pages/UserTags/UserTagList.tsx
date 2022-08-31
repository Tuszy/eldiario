// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// MUI
import { Typography } from "@mui/material";

// Components
import ProfileCard from "../../components/Card/Profile/ProfileCard";
import PagedListWithPost from "../../components/PagedList/PagedListWithPost";

// Helper
import _ from "lodash";
import { fetchUserTagsOfPost } from "../../utils/social-network-post";

// Types
import { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

// Component Context
const UserTagListContext = PagedListContext<SocialNetworkProfile>();

// Component
const UserTagList = () => {
  const { getProfile } = useContext(CachedProfilesAndPostsContext);

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
        Tagged Users
      </Typography>
      <PagedListWithPost
        context={UserTagListContext}
        itemSize={150}
        itemComponent={ProfileCard}
        fetchPageWithItemKeys={fetchUserTagsOfPost}
        fetchItemData={getProfile}
      />
    </>
  );
};

export default UserTagList;
