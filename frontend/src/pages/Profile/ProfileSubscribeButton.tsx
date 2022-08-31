// React
import React, { FC, useContext, useEffect, useState } from "react";

// Context
import EthersContext from "../../contexts/EthersContext/EthersContext";

// Toast
import { toast } from "react-toastify";

// MUI
import { Chip, CircularProgress } from "@mui/material";

// Icon
import {
  Star as UnsubscribeIcon,
  StarBorder as SubscribeIcon,
} from "@mui/icons-material";

// Interface
import { SocialNetwork } from "../../utils/social-network";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
  refetch: () => void;
}

// Component
const ProfileSubscribeButton: FC<Props> = ({ profile, refetch }) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const [isSubscribed, setIsSubscribed] = useState<null | boolean>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validate =
    provider &&
    universalProfile?.socialNetworkProfileDataContract &&
    universalProfile?.socialNetworkProfileDataERC725Contract &&
    profile?.socialProfileStats &&
    profile.address !== universalProfile.address;

  const fetchSubscriptionStatus = async () => {
    if (!validate) return;
    try {
      setIsSubscribed(
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
    if (!validate) return;
    if (
      await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
        profile.address
      )
    ) {
      setIsSubscribed(true);
      return;
    }

    const tx = await SocialNetwork.connect(provider.getSigner()).subscribeUser(
      profile.address
    );
    await tx.wait();
    setIsSubscribed(true);
    await refetch();
  };

  const unsubscribe = async () => {
    if (!validate) return;
    if (
      !(await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
        profile.address
      ))
    ) {
      setIsSubscribed(false);
      return;
    }

    const tx = await SocialNetwork.connect(
      provider.getSigner()
    ).unsubscribeUser(profile.address);
    await tx.wait();
    setIsSubscribed(false);
    await refetch();
  };

  const toggleSubscription = async () => {
    setLoading(true);

    let promise: Promise<any>;
    if (isSubscribed) {
      promise = unsubscribe();
      toast.promise(promise, {
        pending: `Unsubscribing ${profile?.name}...`,
        success: `Successfully unsubscribed ${profile?.name}...`,
        error: `Unsubscribing ${profile?.name} failed. (Probably no LYXe available.)`,
      });
    } else {
      promise = subscribe();
      toast.promise(promise, {
        pending: `Subscribing ${profile?.name}...`,
        success: `Successfully subscribed ${profile?.name}...`,
        error: `Subscribing ${profile?.name} failed. (Probably no LYXe available.)`,
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

  let label: string | React.ReactNode = isSubscribed
    ? "UNSUBSCRIBE"
    : "SUBSCRIBE";
  if (loading) {
    label = (
      <CircularProgress
        size={14}
        sx={{
          mr: (theme) => theme.spacing(2.5),
        }}
      />
    );
  }

  return validate && isSubscribed !== null ? (
    <Chip
      disabled={loading}
      icon={
        isSubscribed ? (
          <UnsubscribeIcon sx={{ fill: "#ffd700" }} />
        ) : (
          <SubscribeIcon sx={{ fill: "#ffd700" }} />
        )
      }
      onClick={toggleSubscription}
      clickable={true}
      label={label}
      sx={{
        zIndex: 1,
        position: "absolute",
        top: (theme) => theme.spacing(1),
        right: (theme) => theme.spacing(1),
        fontWeight: 900,
        letterSpacing: "1px",
        border: "0.5px solid rgba(0,0,0,0.25)",
        boxShadow: "1px 1px 1px 0px rgba(0,0,0,0.25)",
        width: "150px",
        color: "white",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        "& .MuiChip-label": {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "&:hover": {
          background: "#333",
        },
        "&.Mui-disabled": {
          background: "#333",
          opacity: 1,
        },
      }}
    />
  ) : null;
};

export default ProfileSubscribeButton;
