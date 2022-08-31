// React
import React, { FC, useContext } from "react";

// Router
import { Navigate } from "react-router-dom";

// Context
import EthersContext from "../contexts/EthersContext/EthersContext";

interface Props {
  children: React.ReactNode;
}

const AuthenticatedLayout: FC<Props> = ({ children }) => {
  const { universalProfile } = useContext(EthersContext);
  if (!universalProfile?.socialNetworkProfileDataERC725Contract) {
    return <Navigate to="/" replace={true} />;
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
