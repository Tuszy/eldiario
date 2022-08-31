// React
import React, {FC, useState} from 'react'

// MUI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface Props {
    onPost: (content: string) => void;
    onClose: () => void;
    disabled: boolean;
  }
  
  const CreateStandalonePostDialog: FC<Props> = ({ onPost, onClose, disabled }) => {
    const [content, setContent] = useState<string>("");
  
    return (
      <Dialog
        open={true}
        onClose={undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
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
            onClick={() => onPost(content)}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default CreateStandalonePostDialog