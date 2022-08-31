// React
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Router
import { useParams } from "react-router-dom";

// Context
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import EthersContext from "../../contexts/EthersContext/EthersContext";

// MUI
import { Box, Card, Fade } from "@mui/material";

// Components
import ErrorIndicator from "../../components/FullSizeIndicator/ErrorIndicator";
import LoadingIndicator from "../../components/FullSizeIndicator/LoadingIndicator";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileDescription from "./ProfileDescription";
import ProfileTags from "./ProfileTags";
import ProfileLinks from "./ProfileLinks";

// Helper
import _ from "lodash";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

// Component
const Profile = () => {
  const isMounted = useRef(false);
  const { getProfile } = useContext(CachedProfilesAndPostsContext);
  const [profile, setProfile] = useState<null | SocialNetworkProfile>(null);
  const [error, setError] = useState<null | React.ReactNode>(null);

  const { universalProfile } = useContext(EthersContext);
  const { id } = useParams();
  const address: string | undefined = id || universalProfile?.address;

  const initProfile = async (address: string) => {
    const profile = await getProfile(address, true);
    if (!profile) setError(`Profile with address ${address} does not exist`);
    else setProfile(profile);
  };

  const refetch = useCallback(() => initProfile(address ?? ""), [address]);

  useEffect(() => {
    if (!address) return;
    if (!isMounted.current) isMounted.current = true;
    else return;

    initProfile(address);
  }, [address]);

  if (!!error) return <ErrorIndicator error={error} />;
  if (profile === null) return <LoadingIndicator />;

  return (
    <Fade in={true}>
      <Card
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          m: 3,
        }}
      >
        <ProfileHeader profile={profile} refetch={refetch} />
        <ProfileStats profile={profile} />
        <ProfileDescription profile={profile} />
        <ProfileTags profile={profile} />
        <ProfileLinks profile={profile} />

        <Box sx={{ flexShrink: "1", flexGrow: "1" }}></Box>
      </Card>
    </Fade>
  );
};

export default Profile;
