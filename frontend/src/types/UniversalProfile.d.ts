// Crypto
import { ethers } from "ethers";
import { ERC725 } from "@erc725/erc725.js";

// Types
import type { SocialNetworkProfile } from "./SocialNetworkProfile.d";

export type UniversalProfile = SocialNetworkProfile &
  SocialNetworkProfileDataContracts & {
    hasNecessaryPermissions: () => Promise<boolean>;
    setNecessaryPermissions: () => Promise<boolean>;
  };

export interface SocialNetworkProfileDataContracts {
  socialNetworkProfileDataContract: null | ethers.Contract;
  socialNetworkProfileDataERC725Contract: null | ERC725;
}
