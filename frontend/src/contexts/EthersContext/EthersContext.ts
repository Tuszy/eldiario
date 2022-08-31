// React
import React, { createContext } from "react";

// Crypto
import { ethers } from "ethers";

// Types
import type { UniversalProfile } from "../../types/UniversalProfile";

export interface EthersContextValue {
  provider: null | ethers.providers.Web3Provider;
  isUniversalProfileExtension: boolean;
  universalProfile: null | UniversalProfile;
  connectUniversalProfile: () => void;
  initSocialProfileData: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const EthersContext = createContext<EthersContextValue>({
  provider: null,
  isUniversalProfileExtension: false,
  universalProfile: null,
  connectUniversalProfile: () => {},
  initSocialProfileData: async () => {},
  logout: () => {},
  loading: false,
});

export default EthersContext;
