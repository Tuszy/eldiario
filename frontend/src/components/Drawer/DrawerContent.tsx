// React
import React, { FC, useContext } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Context
import EthersContext from "../../contexts/EthersContext/EthersContext";

// MUI
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

// Routes
import { routes } from "../../routes";

// Components
import Logo from "./Logo";
import ConnectUniversalProfileButton from "./ConnectUniversalProfileButton";
import CreatePostButton from "./CreatePostButton";

interface Props {
  setMobileOpen: (open: boolean) => void;
}

const DrawerContent: FC<Props> = ({ setMobileOpen }) => {
  const { universalProfile } = useContext(EthersContext);
  const navigate = useNavigate();

  const onNavigate = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          p: "0 0 0 4px !important",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Logo />
      </Toolbar>
      <Divider sx={{ width: "100%" }} />
      <List
        sx={{ width: "100%", flexGrow: "1", flexShrink: "1", overflow: "auto" }}
      >
        {routes.map((route) => {
          if (route.hideInDrawer) return null;
          if (
            route.hideIfUnregistered &&
            !Boolean(universalProfile?.socialNetworkProfileDataERC725Contract)
          )
            return null;

          return (
            <ListItem key={route.name} disablePadding>
              <ListItemButton onClick={() => onNavigate(route.path)}>
                <ListItemIcon>
                  {route.icon && <route.icon sx={{ fill: "black" }} />}
                </ListItemIcon>
                <ListItemText sx={{ color: "black" }} primary={route.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          width: "100%",
          flexShrink: "0",
          mb: (theme) => theme.spacing(1),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: (theme) => theme.spacing(1),
          pl: (theme) => theme.spacing(1),
          pr: (theme) => theme.spacing(1),
        }}
      >
        <CreatePostButton />
        <ConnectUniversalProfileButton />
      </Box>
    </Box>
  );
};

export default DrawerContent;
