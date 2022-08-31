// React
import React, { FC } from "react";

// Router
import { Link } from "react-router-dom";

// MUI
import { Avatar } from "@mui/material";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";

interface Props {
  profile: SocialNetworkProfile;
}

const ProfileAvatar: FC<Props> = React.memo(({ profile }) => {
  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/profile/${profile.address}`} style={{ textDecoration: "none" }}>
      <Avatar
        onDragStart={preventDefault}
        onDrop={preventDefault}
        alt={profile.name}
        src={profile.profileImage[0]?.url}
        sx={{
          flexShrink: "0",
          flexGrow: "0",
          height: "90px",
          width: "90px",
          border: "2px solid white",
          boxShadow: "1px 1px 4px 0px black",
        }}
      />
    </Link>
  );
}, (prevProps, nextProps) => prevProps.profile.address === nextProps.profile.address);

export default ProfileAvatar;
