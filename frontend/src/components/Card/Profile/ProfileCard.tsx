// React
import React, { FC } from "react";

// MUI
import { Box, Skeleton } from "@mui/material";

// Components
import ProfileCardContent from "./ProfileCardContent";

// Helper
import _ from "lodash";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";
import type { PagedListItemComponentProps } from "../../PagedList/PagedList.d";

const ProfileCard: FC<PagedListItemComponentProps<SocialNetworkProfile>> = React.memo(
  ({ index, sx, loading, value: profile, refetch }) => {

    return (
      <Box p={1} pr={2} pl={2} sx={sx}>
        {loading || !profile ? (
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        ) : (
          <ProfileCardContent profile={profile} refetch={refetch} />
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => _.isEqual(prevProps.value, nextProps.value)
);

export default ProfileCard;
