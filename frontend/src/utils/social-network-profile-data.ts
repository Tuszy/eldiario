// Crypto
import { ethers } from "ethers";
import { ERC725 } from "@erc725/erc725.js";
import { ERC725JsonRpcProvider } from "./ERC725JsonRpcProvider";

// Config
import { IPFS_GATEWAY, RPC_URL } from "./../config";

// Custom
import SocialNetworkProfileArtifact from "../contracts/SocialNetworkProfileData.json";
import {
  getKeysForNamesFromSchema,
  SocialNetworkProfileDataERC725YJSONSchema,
} from "../contracts/SocialNetworkConstants";

// Helper
import _ from "lodash";
import { getSocialNetworkProfileDataAddress } from "./universal-profile";
import { fetchPage } from "./page";

// Types
import type { SocialProfileStats } from "../types/SocialProfileStats";
import type { Page } from "../components/PagedList/PagedList.d";

export const createSocialNetworkProfileDataContract = (
  address: string
): ethers.Contract => {
  return new ethers.Contract(
    address,
    SocialNetworkProfileArtifact.abi,
    new ethers.providers.JsonRpcProvider(RPC_URL)
  );
};

export const createSocialNetworkProfileDataERC725Contract = (
  address: string
): ERC725 => {
  return new ERC725(
    SocialNetworkProfileDataERC725YJSONSchema,
    address,
    new ERC725JsonRpcProvider(RPC_URL),
    {
      ipfsGateway: IPFS_GATEWAY,
    }
  );
};

export const fetchSocialProfileStatsByUniversalProfileAddress = async (
  address: string
): Promise<null | SocialProfileStats> => {
  const socialNetworkProfileDataContractAddress =
    await getSocialNetworkProfileDataAddress(address);
  if (socialNetworkProfileDataContractAddress) {
    const socialNetworkProfileDataContract =
      createSocialNetworkProfileDataContract(
        socialNetworkProfileDataContractAddress
      );

    const keys = getKeysForNamesFromSchema(
      SocialNetworkProfileDataERC725YJSONSchema,
      [
        "SNPosts[]",
        "SNLikes[]",
        "SNSubscriptions[]",
        "SNSubscribers[]",
        "SNUserTags[]",
      ]
    );
    const socialNetworkProfileData = await socialNetworkProfileDataContract[
      "getData(bytes32[])"
    ](keys);

    return {
      posts: parseInt(socialNetworkProfileData[0]) || 0,
      likedPosts: parseInt(socialNetworkProfileData[1]) || 0,
      subscriptions: parseInt(socialNetworkProfileData[2]) || 0,
      subscribers: parseInt(socialNetworkProfileData[3]) || 0,
      postTags: parseInt(socialNetworkProfileData[4]) || 0,
    };
  } else {
    return null;
  }
};

export const fetchPostsOfProfile = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromProfile("SNPosts[]", address, startIndex, stopIndex);

export const fetchLikedPostsOfProfile = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromProfile("SNLikes[]", address, startIndex, stopIndex);

export const fetchSubscriptionsOfProfile = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromProfile("SNSubscriptions[]", address, startIndex, stopIndex);

export const fetchSubscribersOfProfile = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromProfile("SNSubscribers[]", address, startIndex, stopIndex);

export const fetchPostTagsOfProfile = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromProfile("SNUserTags[]", address, startIndex, stopIndex);

const fetchPageFromProfile = async (
  arrayKeyName: string,
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> => {
  const socialNetworkProfileDataContractAddress =
    await getSocialNetworkProfileDataAddress(address);
  if (!socialNetworkProfileDataContractAddress) return null;

  const contract = createSocialNetworkProfileDataContract(
    socialNetworkProfileDataContractAddress
  );

  return await fetchPage(
    contract,
    SocialNetworkProfileDataERC725YJSONSchema,
    arrayKeyName,
    startIndex,
    stopIndex
  );
};
