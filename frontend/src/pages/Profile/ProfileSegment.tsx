// React
import React, { FC } from "react";

// MUI
import { Box, Divider, Typography } from "@mui/material";

interface Props {
  name: string;
  available: boolean;
  showDivider: boolean;
  children: React.ReactNode;
}

const ProfileSegment: FC<Props> = ({
  name,
  available,
  children,
  showDivider,
}) => {
  return (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "gray" }}
          gutterBottom={true}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {available ? (
            children
          ) : (
            <Typography variant="body2" sx={{ color: "lightgray" }}>
              NOT AVAILABLE
            </Typography>
          )}
        </Box>
      </Box>

      {showDivider && <Divider sx={{ width: "100%" }} />}
    </>
  );
};

export default ProfileSegment;
