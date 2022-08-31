// React
import React, { FC, useContext, useEffect, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Context
import EthersContext from "../../../contexts/EthersContext/EthersContext";

// Toast
import { toast } from "react-toastify";

// MUI
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";

// Icon
import {
  Star as UnsubscribeIcon,
  StarBorder as SubscribeIcon,
} from "@mui/icons-material";

// Contract
import { SocialNetwork } from "../../../utils/social-network";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
  onChange: () => void;
}

// Component
const SubscribeProfileButton: FC<Props> = ({ profile, onChange }) => {
  const navigate = useNavigate();
  const { provider, universalProfile } = useContext(EthersContext);
  const [hasSubscribed, setHasSubscribed] = useState<null | boolean>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const authenticated =
    provider &&
    universalProfile?.socialNetworkProfileDataContract &&
    universalProfile?.socialNetworkProfileDataERC725Contract &&
    universalProfile?.socialProfileStats &&
    profile.address.toLowerCase() !== universalProfile?.address.toLowerCase();

  const fetchSubscriptionStatus = async () => {
    if (!authenticated) return;
    try {
      setHasSubscribed(
        await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
          profile.address
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [universalProfile]);

  const subscribe = async () => {
    if (!authenticated) return;
    if (
      await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
        profile.address
      )
    ) {
      setHasSubscribed(true);
      return;
    }

    const tx = await SocialNetwork.connect(provider.getSigner()).subscribeUser(
      profile.address
    );
    await tx.wait();
    setHasSubscribed(true);
    await onChange();
  };

  const unsubscribe = async () => {
    if (!authenticated) return;
    if (
      !(await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
        profile.address
      ))
    ) {
      setHasSubscribed(false);
      return;
    }

    const tx = await SocialNetwork.connect(
      provider.getSigner()
    ).unsubscribeUser(profile.address);
    await tx.wait();
    setHasSubscribed(false);
    await onChange();
  };

  const toggleSubscription = async () => {
    setLoading(true);

    let promise: Promise<any>;
    if (hasSubscribed) {
      promise = unsubscribe();
      toast.promise(promise, {
        pending: `Unsubscribing profile...`,
        success: `Successfully unsubscribed profile...`,
        error: `Unsubscribing profile failed. (Probably no LYXe available.)`,
      });
    } else {
      promise = subscribe();
      toast.promise(promise, {
        pending: `Subscribing profile...`,
        success: `Successfully subscribed profile...`,
        error: `Subscribing profile failed. (Probably no LYXe available.)`,
      });
    }
    try {
      await promise;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToOverview = () =>
    navigate(`/profile/${profile.address}/subscribers`);

  let label: string | React.ReactNode = profile.socialProfileStats?.subscribers;
  if (loading) {
    label = (
      <CircularProgress
        size={9}
        sx={{
          mr: (theme) => theme.spacing(1),
          color: "rgba(0,0,0,0.5)",
        }}
      />
    );
  }

  const Icon = hasSubscribed ? UnsubscribeIcon : SubscribeIcon;

  return (
    <Box
      sx={{
        flex: "1",
        maxWidth: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Tooltip
        title={
          !authenticated
            ? "Show subscribers"
            : hasSubscribed
            ? "Unsubscribe"
            : "Subscribe"
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .icon": {
              fill: "#ffd700",
              background: "#ffd70011",
            },
            "&:hover p": {
              color: "#ffd700",
            },
            gap: (theme) => theme.spacing(0.5),
          }}
          onClick={authenticated ? toggleSubscription : navigateToOverview}
        >
          <Icon
            className={"icon"}
            sx={{ fill: "rgba(0,0,0,0.6)", borderRadius: "50%", p: "4px" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "rgba(0,0,0,0.6)", mb: "-2px", userSelect: "none" }}
            gutterBottom={false}
          >
            {label}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default SubscribeProfileButton;
