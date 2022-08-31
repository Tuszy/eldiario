// React
import React, { FC } from "react";

// Router
import { Link } from "react-router-dom";

// Crypto
import { ethers } from "ethers";

// MUI
import { Typography } from "@mui/material";

// Helper
import _ from "lodash";

// Types
import type { SocialNetworkProfile } from "../../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

const ProfileDescription: FC<Props> = React.memo(
  ({ profile }) => {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "rgba(0,0,0,0.5)",
          width: "100%",
          border: "0.5px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          p: 0.5,
          flexGrow: "1",
          flexShrink: "1",
          wordBreak: "break-all",
          overflowY: "scroll",
        }}
      >
        {profile.description}
      </Typography>
    );
  },
  (prevProps: any, nextProps: any) =>
    _.isEqual(prevProps.profile, nextProps.profile)
);

// Converts string with user tags to React.Node with user links
export const replaceUserTagsWithUserLinks = async (
  content: string,
  fetchProfile: (address: string) => Promise<null | SocialNetworkProfile>
): Promise<React.ReactNode> => {
  const possibleAddressMatches = Array.from(content.matchAll(/\{(.+?)\}/g));
  let contentParts = content.split(/\{.+?\}/);

  let newContent = [];
  for (let i = 0; i < possibleAddressMatches.length; i++) {
    newContent.push(contentParts[i]);
    const possibleAddress = possibleAddressMatches[i][1];
    if (ethers.utils.isAddress(possibleAddress)) {
      const profile = await fetchProfile(possibleAddress);
      if (profile?.name) {
        newContent.push(
          <Link
            to={`/profile/${possibleAddress}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            @{profile.name}
          </Link>
        );
        continue;
      }
    }
    newContent.push(possibleAddress);
  }
  newContent.push(contentParts[contentParts.length - 1]);

  return (
    <span>
      {newContent.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </span>
  );
};

export default ProfileDescription;
