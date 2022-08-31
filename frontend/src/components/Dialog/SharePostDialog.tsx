// React
import React, { FC, useState } from "react";

// MUI
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

// Components
import PostCardContent from "../Card/Post/PostCardContent";

// Types
import type { SocialNetworkPost } from "../../types/SocialNetworkPost";
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";
interface Props {
  post: SocialNetworkPost;
  author: SocialNetworkProfile;
  onShare: (content: string) => void;
  onClose: () => void;
  disabled: boolean;
}

const SharePostDialog: FC<Props> = ({
  post,
  author,
  onShare,
  onClose,
  disabled,
}) => {
  const [content, setContent] = useState<string>("");

  return (
    <Dialog open={true} onClose={undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Share Post</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          gap: (theme) => theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            height: "200px",
          }}
        >
          <PostCardContent
            post={post}
            author={author}
            refetch={() => {}}
            hideInteraction={true}
          />
        </Box>
        <TextField
          disabled={disabled}
          multiline
          rows={4}
          autoFocus
          margin="dense"
          label="Message"
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} sx={{ color: "black" }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          sx={{ color: "black" }}
          disabled={content.length === 0 || disabled}
          onClick={() => onShare(content)}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SharePostDialog;
