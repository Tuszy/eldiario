// React
import React, { FC, useMemo } from "react";

// Router
import { Link } from "react-router-dom";

// MUI
import { Box, Chip, CircularProgress } from "@mui/material";

// Icons
import {
  Favorite as LikedPostIcon,
  PeopleAlt as SubscriberIcon,
  Star as SubscriptionIcon,
  AlternateEmail as TagIcon,
  ChatBubbleOutline as PostIcon,
} from "@mui/icons-material";

// Components
import ProfileSegment from "./ProfileSegment";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileStats: FC<Props> = ({ profile }) => {
  const stats = useMemo(
    () => [
      {
        path: `/profile/${profile?.address}/posts`,
        icon: PostIcon,
        amount: profile?.socialProfileStats?.posts ?? 0,
        label: "Posts",
      },
      {
        path: `/profile/${profile?.address}/likes`,
        icon: LikedPostIcon,
        amount: profile?.socialProfileStats?.likedPosts ?? 0,
        label: "Liked Posts",
      },
      {
        path: `/profile/${profile?.address}/subscribers`,
        icon: SubscriberIcon,
        amount: profile?.socialProfileStats?.subscribers ?? 0,
        label: "Subscribers",
      },
      {
        path: `/profile/${profile?.address}/subscriptions`,
        icon: SubscriptionIcon,
        amount: profile?.socialProfileStats?.subscriptions ?? 0,
        label: "Subscriptions",
      },
      {
        path: `/profile/${profile?.address}/tags`,
        icon: TagIcon,
        amount: profile?.socialProfileStats?.postTags ?? 0,
        label: "Post Tags",
      },
    ],
    [profile?.socialProfileStats]
  );

  if (!profile?.socialProfileStats) return null;

  return (
    <ProfileSegment name="" showDivider={true} available={true}>
      <Box
        sx={{
          display: "flex",
          gap: (theme) => theme.spacing(1),
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            style={{ textDecoration: "none" }}
          >
            <Chip
              icon={<stat.icon />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: (theme) => theme.spacing(1),
                  }}
                >
                  {profile?.socialProfileStats ? (
                    stat.amount
                  ) : (
                    <CircularProgress
                      size={15}
                      sx={{ color: "rgba(0,0,0,0.4)" }}
                    />
                  )}{" "}
                  {stat.label}
                </Box>
              }
              sx={{
                flexGrow: "1",
                color: "black",
                mr: 1,
                ml: 1,
                cursor: "pointer",
                transition: "0.1s ease-in-out",
                "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
                minWidth: "150px",
              }}
            />
          </Link>
        ))}
      </Box>
    </ProfileSegment>
  );
};

export default ProfileStats;
