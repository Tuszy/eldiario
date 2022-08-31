// React
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Router
import { useParams } from "react-router-dom";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// MUI
import { Box } from "@mui/material";

// Components
import PagedList from "./PagedList";
import ErrorIndicator from "../FullSizeIndicator/ErrorIndicator";
import LoadingIndicator from "../FullSizeIndicator/LoadingIndicator";
import PostCardContent from "../Card/Post/PostCardContent";

// Helper
import { fetchPost } from "../../utils/social-network-post";

// Types
import type { PagedListWithoutURIParamProps } from "./PagedList.d";
import type { SocialNetworkPost } from "../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

const PagedListWithPost = <ItemValueType,>(
  props: PropsWithChildren<PagedListWithoutURIParamProps<ItemValueType>>
) => {
  const isMounted = useRef(false);
  const [post, setPost] = useState<null | SocialNetworkPost>(null);
  const [author, setAuthor] = useState<null | SocialNetworkProfile>(null);
  const [error, setError] = useState<null | React.ReactNode>(null);
  const { getProfile, getPost } = useContext(CachedProfilesAndPostsContext);
  const { id: address } = useParams();

  const initPost = async (address: string) => {
    try {
      const post = await fetchPost(address);
      if (!post) throw Error();
      setPost(post);
      initAuthor(post.author);
    } catch (e) {
      setError(`Post with address ${address} does not exist`);
    }
  };

  const initAuthor = async (address: string) => {
    try {
      const author = await getProfile(address);
      if (!author) throw Error();
      setAuthor(author);
    } catch (e) {
      setError(`Profile with address ${address} does not exist`);
    }
  };

  const refetchPost = async () =>
    address ? setPost(await getPost(address, true)) : null;

  useEffect(() => {
    if (!address) return;
    if (!isMounted.current) isMounted.current = true;
    else return;

    initPost(address);
  }, [address]);

  if (!!error) return <ErrorIndicator error={error} />;
  if (post === null || author === null) return <LoadingIndicator />;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 32px)",
      }}
    >
      <Box
        sx={{ width: "100%", height: "150px", mb: (theme) => theme.spacing(2) }}
      >
        <PostCardContent post={post} author={author} refetch={refetchPost} />
      </Box>
      <Box
        sx={{
          width: "100%",
          flexGrow: "1",
          flexShrink: "1",
        }}
      >
        <PagedList uri={address ?? ""} {...props} />
      </Box>
    </Box>
  );
};

export default PagedListWithPost;
