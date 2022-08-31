// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// Components
import ProfileCard from "../../components/Card/Profile/ProfileCard";
import PagedList from "../../components/PagedList/PagedList";

// Contract Functions
import { SocialNetwork } from "../../utils/social-network";

// Helper
import _ from "lodash";

// Types
import type { Page } from "../../components/PagedList/PagedList.d";
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

// Component Context
const ProfileListContext = PagedListContext<SocialNetworkProfile>();

// Component
const ProfileList = () => {
  const { getProfile } = useContext(CachedProfilesAndPostsContext);

  const fetchProfileAddresses = async (): Promise<null | Page<string>> => {
    const page: Page<string> = {
      totalItemCount: 0,
      itemCount: 0,
      items: {},
    };
    try {
      const eventFilter = SocialNetwork.filters.UserRegistered();
      const events = await SocialNetwork.queryFilter(eventFilter);
      page.items = events
        .map((event) => event?.args?.user)
        .filter((address) => address)
        .reduce(
          (items, item, index) => ({
            ...items,
            [(index + 1).toString()]: item, // increment by 1 since 0 is sentinel value
          }),
          {}
        );
      page.itemCount = page.totalItemCount = Object.keys(page.items).length;
    } catch (e) {
      console.error(e);
    }

    return page;
  };

  return (
    <PagedList
      uri={true}
      context={ProfileListContext}
      itemSize={150}
      itemComponent={ProfileCard}
      fetchPageWithItemKeys={fetchProfileAddresses}
      fetchItemData={getProfile}
    />
  );
};

export default ProfileList;
