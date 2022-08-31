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
import EthersContext from "../../contexts/EthersContext/EthersContext";
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// MUI
import { Box } from "@mui/material";

// Components
import PagedList from "./PagedList";
import ErrorIndicator from "../FullSizeIndicator/ErrorIndicator";
import LoadingIndicator from "../FullSizeIndicator/LoadingIndicator";
import ProfileCardContent from "../Card/Profile/ProfileCardContent";

// Helper
import { fetchProfile } from "../../utils/universal-profile";

// Types
import type { PagedListWithoutURIParamProps } from "./PagedList.d";
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

const PagedListWithProfile = <ItemValueType,>(
  props: PropsWithChildren<PagedListWithoutURIParamProps<ItemValueType>>
) => {
  const isMounted = useRef(false);
  const [profile, setProfile] = useState<null | SocialNetworkProfile>(null);
  const [error, setError] = useState<null | React.ReactNode>(null);
  const { universalProfile } = useContext(EthersContext);
  const { getProfile } = useContext(CachedProfilesAndPostsContext);
  const { id } = useParams();
  const address: string | undefined = id || universalProfile?.address;

  const initProfile = async (address: string) => {
    const profile = await fetchProfile(address);
    if (!profile) setError(`Profile with address ${address} does not exist`);
    else if (!profile.socialProfileStats)
      setError(`Profile with address ${address} is not registered`);
    else setProfile(profile);
  };

  const refetchProfile = async () =>
    address ? setProfile(await getProfile(address, true)) : null;

  useEffect(() => {
    if (!address) return;
    if (!isMounted.current) isMounted.current = true;
    else return;

    if (address === universalProfile?.address) {
      setProfile(universalProfile);
    } else {
      initProfile(address);
    }
  }, [address]);

  if (!!error) return <ErrorIndicator error={error} />;
  if (profile === null) return <LoadingIndicator />;

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
        <ProfileCardContent profile={profile} refetch={refetchProfile} />
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

export default PagedListWithProfile;
