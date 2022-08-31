// React
import React, { FC, useState } from "react";

// Components
import AppBar from "./AppBar";
import DrawerContainer from "./DrawerContainer";
import DrawerLayoutContentContainer from "./DrawerLayoutContentContainer";

interface Props {
  children: React.ReactNode;
}

const DrawerLayout: FC<Props> = ({ children }) => {
  const [drawerWidth] = useState(200);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        width={drawerWidth}
      />
      <DrawerContainer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        width={drawerWidth}
      />
      <DrawerLayoutContentContainer width={drawerWidth}>
        {children}
      </DrawerLayoutContentContainer>
    </>
  );
};

export default DrawerLayout;
