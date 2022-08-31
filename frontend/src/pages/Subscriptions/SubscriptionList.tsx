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
import { fetchSubscriptionsOfProfile } from "../../utils/social-network-profile-data";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

// Component Context
const SubscriptionListContext = PagedListContext<SocialNetworkProfile>();

// Component
const SubscriptionList = () => {
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
        Subscriptions
      </Typography>
      <PagedListWithProfile
        context={SubscriptionListContext}
        itemSize={150}
        itemComponent={ProfileCard}
        fetchPageWithItemKeys={fetchSubscriptionsOfProfile}
        fetchItemData={getProfile}
      />
    </>
  );
};

export default SubscriptionList;
