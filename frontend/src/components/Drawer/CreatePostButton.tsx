// React
import React, { FC, useContext, useState } from "react";

// Icons
import { Send as SendIcon } from "@mui/icons-material";

// Toast
import { toast } from "react-toastify";

// Contexts
import EthersContext from "../../contexts/EthersContext/EthersContext";
import CachedProfilesAndPostsContext from "../../contexts/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// Components
import CreateStandalonePostDialog from "../Dialog/CreateStandalonePostDialog";
import LoadingButton from "../Loading/LoadingButton";

// MUI Types
import { SxProps, Theme } from "@mui/material";

// Contract Functions
import {
  createStandalonePost,
  getUserTags,
} from "../../utils/social-network-post";
interface Props {
  sx?: SxProps<Theme> | undefined;
}

const CreatePostButton: FC<Props> = ({ sx }) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const { getProfile } = useContext(CachedProfilesAndPostsContext);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const validate =
    provider &&
    universalProfile &&
    universalProfile.socialNetworkProfileDataContract;

  if (!validate) return null;

  const post = async (content: string) => {
    setLoading(true);
    const promise = createStandalonePost(provider, content);
    toast.promise(promise, {
      pending: `Creating post...`,
      success: `Successfully created post...`,
      error: `Creating post failed. (Probably no LYXe available.)`,
    });
    try {
      await promise;
      const taggedProfileAddresses = await getUserTags(content);
      for (const profileAddress of taggedProfileAddresses) {
        await getProfile(profileAddress, true);
      }
    } catch (e) {
      console.log(e);
    }
    setShowDialog(false);
    setLoading(false);
  };

  return (
    <>
      <LoadingButton
        loading={showDialog || loading}
        loadingText="Waiting..."
        sx={{
          width: "100%",
          pt: 1,
          pb: 1,
          bgcolor: "black",
          color: (theme) => theme.palette.secondary.main,
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.7)",
          },
          fontSize: "0.75rem",
          ...(sx ?? {}),
        }}
        onClick={() => setShowDialog(true)}
        buttonProps={{ variant: "contained" }}
      >
        <SendIcon sx={{ mr: 0.75 }} /> CREATE POST
      </LoadingButton>
      {showDialog && (
        <CreateStandalonePostDialog
          onPost={post}
          onClose={() => setShowDialog(false)}
          disabled={loading}
        />
      )}
    </>
  );
};

export default CreatePostButton;
