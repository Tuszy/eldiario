// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// MUI
import { Typography } from "@mui/material";

// Components
import ProfileCard from "../../components/Card/Profile/ProfileCard";
import PagedListWithProfile from "../../components/PagedList/PagedListWithProfile";

// Helper
import _ from "lodash";
import { fetchSubscribersOfProfile } from "../../utils/social-network-profile-data";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

// Component Context
const SubscriberListContext = PagedListContext<SocialNetworkProfile>();

// Component
const SubscriberList = () => {
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
        Subscribers
      </Typography>
      <PagedListWithProfile
        context={SubscriberListContext}
        itemSize={150}
        itemComponent={ProfileCard}
        fetchPageWithItemKeys={fetchSubscribersOfProfile}
        fetchItemData={getProfile}
      />
    </>
  );
};

export default SubscriberList;
