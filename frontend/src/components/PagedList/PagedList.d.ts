// React
import React from "react";

// MUI Types
import type { SxProps, Theme } from "@mui/material";

export interface Page<ItemValueType> {
  totalItemCount: number;
  itemCount: number;
  items: { [key: string]: ItemValueType };
}

export interface PagedListContextValue<ItemValueType> {
  error: null | React.ReactNode;
  items: { [key: string]: ItemValueType };
  itemCount: null | number;
  loadMoreItems: (
    startIndex: number,
    stopIndex: number,
    ignoreCache?: boolean
  ) => void;
  isItemLoaded: (index: number) => boolean;
}

export interface PagedListContextProviderProps<ItemValueType> {
  context: React.Context<PagedListContextValue<ItemValueType>>;
  fetchPageWithItemValues: (
    startIndex: number,
    stopIndex: number,
    ignoreCache?: boolean
  ) => Promise<null | Page<ItemValueType>>;
}

export type PagedListWithoutURIParamProps<ItemValueType> =
  PagedListContentProps<ItemValueType> & {
    fetchPageWithItemKeys: (
      uri: URIType,
      startIndex: number,
      stopIndex: number
    ) => Promise<null | Page<string>>;
    fetchItemData: (key: string) => Promise<null | ItemValueType>;
  };

export type PagedListProps<URIType, ItemValueType> =
  PagedListWithoutURIParamProps<ItemValueType> & {
    uri: URIType;
  };

export interface PagedListContentProps<ItemValueType> {
  context: React.Context<PagedListContextValue<ItemValueType>>;
  itemSize: number;
  itemComponent: React.FC<PagedListItemComponentProps<ItemValueType>>;
}

export type PagedListItemProps<ItemValueType> =
  PagedListItemComponentProps<ItemValueType> & {
    itemComponent: React.FC<PagedListItemComponentProps<ItemValueType>>;
  };

export interface PagedListItemComponentProps<ItemValueType> {
  index: number;
  sx?: SxProps<Theme> | undefined;
  loading: boolean;
  value: null | ItemValueType;
  refetch: () => void;
}
