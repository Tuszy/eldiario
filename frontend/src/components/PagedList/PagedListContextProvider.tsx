// React
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

// Types
import type {
  PagedListContextValue,
  PagedListContextProviderProps,
} from "./PagedList.d";

// Context Provider
const PagedListContextProvider = <ValueType,>({
  context: Context,
  children,
  fetchPageWithItemValues,
}: PropsWithChildren<PagedListContextProviderProps<ValueType>>) => {
  const isMounted = useRef(false);
  const [error, setError] = useState<null | string>(null);
  const [itemCount, setItemCount] = useState<null | number>(null);
  const [items, setItems] = useState<{ [key: string]: ValueType }>({});

  const loadMoreItems = async (
    startIndex: number,
    stopIndex: number,
    ignoreCache?: boolean
  ) => {
    try {
      const page = await fetchPageWithItemValues(
        startIndex,
        stopIndex,
        ignoreCache
      );
      if (!page) return;
      setItemCount(page.totalItemCount);
      setItems((data) => ({ ...data, ...page.items }));
    } catch (e) {
      console.error(e);
      // setError("Data is not available");
    }
  };

  useEffect(() => {
    if (!isMounted.current) isMounted.current = true;
    else return;

    loadMoreItems(-1, -1);
  }, []);

  // Since 0 is a sentinel value we must increment the index by one
  const isItemLoaded = (index: number) =>
    Boolean(items[(index + 1).toString()]);

  const value: PagedListContextValue<ValueType> = useMemo<
    PagedListContextValue<ValueType>
  >(
    () => ({
      error,
      itemCount,
      items,
      loadMoreItems,
      isItemLoaded,
    }),
    [error, itemCount, items]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PagedListContextProvider;
