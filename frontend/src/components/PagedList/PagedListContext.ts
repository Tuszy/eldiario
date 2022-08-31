// React
import React, { createContext } from "react";

// Types
import type { PagedListContextValue } from "./PagedList.d";

const PagedListContext = <ItemValueType>(): React.Context<
  PagedListContextValue<ItemValueType>
> =>
  createContext<PagedListContextValue<ItemValueType>>({
    error: null,
    itemCount: null,
    items: {},
    loadMoreItems: () => {},
    isItemLoaded: () => false,
  });

export default PagedListContext;
