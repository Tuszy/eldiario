// React
import React, { useContext } from "react";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import PagedListContext from "../../components/PagedList/PagedListContext";

// Components
import PostCard from "../../components/Card/Post/PostCard";
import PagedList from "../../components/PagedList/PagedList";

// Contract Functions
import { SocialNetwork } from "../../utils/social-network";

// Helper
import _ from "lodash";

// Types
import type { Page } from "../../components/PagedList/PagedList.d";
import type { SocialNetworkPost } from "../../types/SocialNetworkPost";

// Component Context
const HomeContext = PagedListContext<SocialNetworkPost>();

// Component
const Home = () => {
  const { getPost } = useContext(CachedProfilesAndPostsContext);

  const fetchPostAddresses = async (): Promise<null | Page<string>> => {
    const page: Page<string> = {
      totalItemCount: 0,
      itemCount: 0,
      items: {},
    };
    try {
      const eventFilter = SocialNetwork.filters.UserCreatedPost();
      const events = await SocialNetwork.queryFilter(eventFilter);
      page.items = _.reverse(
        events.map((event) => event?.args?.newPost).filter((address) => address)
      ).reduce(
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
      context={HomeContext}
      itemSize={200}
      itemComponent={PostCard}
      fetchPageWithItemKeys={fetchPostAddresses}
      fetchItemData={getPost}
    />
  );
};

export default Home;
