// Crypto
import { ethers } from "ethers";

// Custom
import SocialNetworkArtifact from "../contracts/SocialNetwork.json";
import { ERC725JsonRpcProvider } from "./ERC725JsonRpcProvider";

// Config
import { RPC_URL, SOCIAL_NETWORK_CONTRACT_ADDRESS } from "./../config";

const createSocialNetworkContract = (): ethers.Contract =>
  new ethers.Contract(
    SOCIAL_NETWORK_CONTRACT_ADDRESS,
    SocialNetworkArtifact.abi,
    new ERC725JsonRpcProvider(RPC_URL)
  );

export const SocialNetwork: ethers.Contract = createSocialNetworkContract();
