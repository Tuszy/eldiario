// React
import React, { PropsWithChildren, useContext } from "react";

// Virtualization
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "../AutoSizer/AutoSizer";

// Components
import PagedListItem from "./PagedListItem";
import ErrorIndicator from "../FullSizeIndicator/ErrorIndicator";
import LoadingIndicator from "../FullSizeIndicator/LoadingIndicator";

// Helper
import _ from "lodash";

// Types
import type { PagedListContentProps } from "./PagedList.d";

// Component
const PagedListContent = React.memo(
  <ItemValueType,>({
    context,
    itemSize,
    itemComponent,
  }: PropsWithChildren<PagedListContentProps<ItemValueType>>) => {
    const { itemCount, items, error, loadMoreItems, isItemLoaded } =
      useContext(context);

    const Row = ({ index, style }: ListChildComponentProps) => {
      const elementIndex = index + 1; // 0 is sentinel value so we must increment the index by 1
      const indexAsString = elementIndex.toString();
      return (
        <PagedListItem
          refetch={() => loadMoreItems(index, index, true)}
          index={elementIndex}
          sx={style}
          value={items[indexAsString] ?? null}
          loading={!isItemLoaded(index)}
          itemComponent={itemComponent}
        />
      );
    };

    if (!!error) return <ErrorIndicator error={error} />;
    if (itemCount === 0) return <ErrorIndicator error={"NOT AVAILABLE"} />;
    if (itemCount === null) return <LoadingIndicator />;

    return (
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
            isItemLoaded={isItemLoaded}
          >
            {({ onItemsRendered, ref }: any) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={itemSize}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {Row}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    );
  },
  (prevProps, nextProps) => _.isEqual(prevProps, nextProps)
);

export default PagedListContent;
