// React
import React, { FC } from "react";

// MUI
import { Box } from "@mui/material";

// Components
import SubscribeProfileButton from "./SubscribeProfileButton";
import ShowSubscriptionsButton from "./ShowSubscriptionsButton";
import ShowPostsButton from "./ShowPostsButton";
import ShowLikedPostsButton from "./ShowLikedPostsButton";
import ShowPostTagsButton from "./ShowPostTagsButton";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
  refetch: () => void;
}

const ProfileInteraction: FC<Props> = ({ profile, refetch }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        flexGrow: "0",
        flexShrink: "0",
        gap: (theme) => theme.spacing(1),
      }}
    >
      <SubscribeProfileButton profile={profile} onChange={refetch} />
      <ShowSubscriptionsButton profile={profile} />
      <ShowPostsButton profile={profile} />
      <ShowLikedPostsButton profile={profile} />
      <ShowPostTagsButton profile={profile} />
    </Box>
  );
};

export default ProfileInteraction;
