// React
import React, { FC } from "react";

// MUI
import { Avatar, Box, Tooltip, Typography } from "@mui/material";

// Components
import CopyText from "../../components/FunctionalWrapper/CopyText";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: null | SocialNetworkProfile;
}

// Component
const ProfileImageWithName: FC<Props> = ({ profile }) => {
  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Box
      sx={{
        zIndex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Avatar
        onDragStart={preventDefault}
        onDrop={preventDefault}
        alt={profile?.name}
        src={profile?.profileImage[0]?.url}
        sx={{
          width: "128px",
          height: "128px",
          border: "2px solid white",
          boxShadow: "1px 1px 4px 0px black",
        }}
      />
      <CopyText copyValue={profile?.address ?? ""}>
        {(copy, copied) => (
          <Tooltip
            title="Click to copy address"
            arrow
            enterDelay={0}
            placement="right"
            disableInteractive={true}
          >
            <Box
              onClick={copy}
              sx={{
                pl: 2,
                pr: 2,
                mt: 1,
                background: "rgba(0,0,0,0.1)",
                backdropFilter: "blur(4px)",
                border: "0.5px solid rgba(255,255,255,0.75)",
                boxShadow: "1px 1px 2px 0px black",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.2s ease-in-out",
                "&:hover": {
                  background: "rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "1.5px 1.5px rgba(0,0,0,0.25)",
                  userSelect: "none",
                }}
              >
                {!copied ? (
                  <>
                    {profile?.name}#{profile?.address.substring(2, 6)}
                  </>
                ) : (
                  "ADDRESS COPIED"
                )}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </CopyText>
    </Box>
  );
};

export default ProfileImageWithName;
