// React
import React, { useState, useContext, useEffect } from "react";

// MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Toast
import { toast } from "react-toastify";

// Components
import SlideUpTransition from "./SlideUpTransition";
import LoadingBackdrop from "../Loading/LoadingBackdrop";

// Context
import EthersContext from "../../contexts/EthersContext/EthersContext";
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// Contract
import { SocialNetwork } from "../../utils/social-network";

const RegistrationDialog = () => {
  const [hasNecessaryPermissions, setHasPermissions] = useState<
    undefined | boolean
  >(undefined);
  const { refetchAll } = useContext(CachedProfilesAndPostsContext);
  const {
    provider,
    universalProfile,
    initSocialProfileData,
    logout,
  } = useContext(EthersContext);

  const [registrationInProgress, setRegistrationInProgress] =
    useState<boolean>(false);
  const [settingPermissionsInProgress, setSettingPermissionsInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    if (!universalProfile) {
      setHasPermissions(false);
    } else {
      setHasPermissions(undefined);
      universalProfile.hasNecessaryPermissions().then(setHasPermissions);
    }
  }, [universalProfile]);

  const validate = (): boolean =>
    Boolean(provider) && Boolean(universalProfile);

  const register = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (universalProfile!.socialNetworkProfileDataERC725Contract) return true; // already registered

    setRegistrationInProgress(true);
    try {
      const tx = await SocialNetwork.connect(provider!.getSigner()).register();
      await tx.wait();
      await initSocialProfileData();
    } catch (e) {
      console.error("❌ register failed: ", e);
      setRegistrationInProgress(false);
      return false;
    }

    await refetchAll();
    setRegistrationInProgress(false);
    return true;
  };

  const setPermissions = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (await universalProfile!.hasNecessaryPermissions()) return true;

    setSettingPermissionsInProgress(true);
    const hasPermissions = await universalProfile!.setNecessaryPermissions();
    setHasPermissions(hasPermissions);
    setSettingPermissionsInProgress(false);

    return hasPermissions;
  };

  const onDisagree = () => {
    setRegistrationInProgress(false);
    setSettingPermissionsInProgress(false);
    logout();
  };

  const onAgree = async () => {
    if (!(await register())) {
      toast.error(`Registration failed`);
      return;
    }
    if (!(await setPermissions())) {
      toast.error(`Setting necessary permissions failed`);
      return;
    }
  };

  return (
    <>
      <Dialog
        open={
          Boolean(provider) &&
          Boolean(universalProfile) &&
          !registrationInProgress &&
          !settingPermissionsInProgress &&
          (hasNecessaryPermissions === false ||
            !universalProfile!.socialNetworkProfileDataERC725Contract)
        }
        TransitionComponent={SlideUpTransition}
        keepMounted
      >
        <DialogTitle>Welcome {universalProfile?.name ?? ""}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use the platform we need to register your universal profile
            address and set a CALL permission. Do you agree?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDisagree} sx={{ color: "black" }}>
            Disagree
          </Button>
          <Button onClick={onAgree} sx={{ color: "black" }}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingBackdrop
        open={registrationInProgress}
        text={
          "Waiting for the completion of registering the universal profile address..."
        }
      />

      <LoadingBackdrop
        open={settingPermissionsInProgress}
        text={
          "Waiting for the completion of setting the necessary CALL permission on the universal profile..."
        }
      />
    </>
  );
};

export default RegistrationDialog;
