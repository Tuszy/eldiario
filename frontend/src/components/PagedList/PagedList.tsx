// @ts-nocheck
// React
import React, { PropsWithChildren } from "react";

// Components
import PagedListContent from "./PagedListContent";

// Types
import type { Page, PagedListProps } from "./PagedList.d";
import PagedListContextProvider from "./PagedListContextProvider";

// Component
const PagedList = <URIType, ItemValueType>({
  uri,
  fetchPageWithItemKeys,
  fetchItemData,
  context,
  ...props
}: PropsWithChildren<PagedListProps<URIType, ItemValueType>>) => {
  const fetchPageWithItemValues = async (
    startIndex: number,
    stopIndex: number,
    ignoreCache?: boolean
  ): Promise<null | Page<ItemValueType>> => {
    if (!uri) return null;

    const page = await fetchPageWithItemKeys(uri, startIndex, stopIndex);
    if (!page) return null;

    const processedPage: Page<ItemValueType> = {
      totalItemCount: page.totalItemCount,
      itemCount: page.itemCount,
      items: {},
    };

    const promises: Promise<null | ItemValueType>[] = [];
    const indices = Object.keys(page.items);
    for (const index of indices) {
      promises.push(fetchItemData(page.items[index], ignoreCache));
    }

    const resolvedPromises: (null | ItemValueType)[] = await Promise.all(
      promises
    );
    for (let i = 0; i < indices.length; i++) {
      if (resolvedPromises[i])
        processedPage.items[indices[i]] = resolvedPromises[i]!;
      else delete processedPage.items[indices[i]];
    }

    return processedPage;
  };

  return (
    <PagedListContextProvider
      context={context}
      fetchPageWithItemValues={fetchPageWithItemValues}
    >
      <PagedListContent context={context} {...props} />
    </PagedListContextProvider>
  );
};

export default PagedList;
