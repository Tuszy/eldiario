// Crypto
import { ethers } from "ethers";
import { ERC725 } from "@erc725/erc725.js";
import { ERC725JsonRpcProvider } from "./ERC725JsonRpcProvider";

// Config
import {
  IPFS_GATEWAY,
  RPC_URL,
  SOCIAL_NETWORK_CONTRACT_ADDRESS,
} from "../config";

// Custom
import SocialNetworkPostArtifact from "../contracts/SocialNetworkPost.json";
import {
  getKeysForNamesFromSchema,
  INTERFACE_IDS,
  SocialNetworkPostERC725YJSONSchema,
} from "../contracts/SocialNetworkConstants";
import { ERC725Modified } from "./ERC725Modified";

// Contract
import { SocialNetwork } from "./social-network";

// Helper
import { getSocialNetworkProfileDataAddress } from "./universal-profile";
import { uploadJSONToIPFSAndGetLSP2JSONURL } from "./ipfs-client";
import { fetchPage } from "./page";
import _ from "lodash";

// Types
import type {
  PostType,
  SocialNetworkPost,
  SocialNetworkPostStats,
} from "../types/SocialNetworkPost";
import type { Page } from "../components/PagedList/PagedList.d";

export const createSocialNetworkPostContract = (
  address: string
): ethers.Contract => {
  return new ethers.Contract(
    address,
    SocialNetworkPostArtifact.abi,
    new ethers.providers.JsonRpcProvider(RPC_URL)
  );
};

export const createSocialNetworkPostERC725Contract = (
  address: string
): ERC725 => {
  return new ERC725(
    SocialNetworkPostERC725YJSONSchema,
    address,
    new ERC725JsonRpcProvider(RPC_URL),
    {
      ipfsGateway: IPFS_GATEWAY,
    }
  );
};

export const isValidPost = async (address: string): Promise<boolean> => {
  if (!ethers.utils.isAddress(address)) return false;

  try {
    const socialNetworkPostContract = createSocialNetworkPostContract(address);

    const owner = await socialNetworkPostContract.owner();
    if (owner.toLowerCase() !== SOCIAL_NETWORK_CONTRACT_ADDRESS.toLowerCase())
      return false;

    return await socialNetworkPostContract.supportsInterface(
      INTERFACE_IDS.SocialNetworkPost
    );
  } catch (e) {
    return false;
  }
};

export const fetchPost = async (
  address: string
): Promise<null | SocialNetworkPost> => {
  if (!(await isValidPost(address))) return null;

  try {
    const socialNetworkPostContract = createSocialNetworkPostContract(address);
    const socialNetworkPostERC725Contract = new ERC725Modified(
      createSocialNetworkPostERC725Contract(address)
    );

    const author = await socialNetworkPostContract.author();
    const referencedPost = await socialNetworkPostContract.referencedPost();
    const type: PostType = await socialNetworkPostContract.postType();

    let content = "";
    try {
      const postContentData: any =
        await socialNetworkPostERC725Contract.fetchData("SNPostContent");
      content = postContentData?.value?.content ?? "";
    } catch (e) {}

    const taggedUsers: string[] =
      ((await socialNetworkPostERC725Contract.fetchData("SNUserTags[]"))
        ?.value as string[]) ?? [];

    const socialNetworkPostStats = await fetchSocialNetworkPostStats(address);

    return {
      author,
      address,
      referencedPost,
      type,
      content,
      taggedUsers,
      ...socialNetworkPostStats,
    } as SocialNetworkPost;
  } catch (e) {
    return null;
  }
};

export const fetchSocialNetworkPostStats = async (
  address: string
): Promise<null | SocialNetworkPostStats> => {
  const socialNetworkPostContract = createSocialNetworkPostContract(address);

  const keys = getKeysForNamesFromSchema(SocialNetworkPostERC725YJSONSchema, [
    "SNLikes[]",
    "SNShares[]",
    "SNComments[]",
  ]);
  const socialNetworkPost = await socialNetworkPostContract[
    "getData(bytes32[])"
  ](keys);

  return {
    likes: parseInt(socialNetworkPost[0]) || 0,
    shares: parseInt(socialNetworkPost[1]) || 0,
    comments: parseInt(socialNetworkPost[2]) || 0,
  };
};

export const fetchLikesOfPost = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromPost("SNLikes[]", address, startIndex, stopIndex);

export const fetchSharesOfPost = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromPost("SNShares[]", address, startIndex, stopIndex);

export const fetchCommentsOfPost = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromPost("SNComments[]", address, startIndex, stopIndex);

export const fetchUserTagsOfPost = async (
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> =>
  fetchPageFromPost("SNUserTags[]", address, startIndex, stopIndex);

const fetchPageFromPost = async (
  arrayKeyName: string,
  address: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> => {
  const contract = createSocialNetworkPostContract(address);

  return await fetchPage(
    contract,
    SocialNetworkPostERC725YJSONSchema,
    arrayKeyName,
    startIndex,
    stopIndex
  );
};

export const getUserTags = async (content: string) => {
  const addresses = _.uniq(
    Array.from(content.matchAll(/\{(0x[A-Fa-f0-9]{40})\}/g))
      .map((userTag) => userTag[1])
      .filter((address) => ethers.utils.isAddress(address))
  ).slice(0, 3); // max 3 user tags

  for (let i = 0; i < addresses.length; i++) {
    if (!Boolean(await getSocialNetworkProfileDataAddress(addresses[i]))) {
      throw Error(
        `Invalid tag. Profile with address ${addresses[i]} is not registered.`
      );
    }
  }

  return addresses;
};

export const createStandalonePost = async (
  provider: ethers.providers.Web3Provider,
  content: string
): Promise<null | SocialNetworkPost> => {
  if (content.length === 0) return null;

  const preparedData: any = await preparePost(content);
  if (!preparedData) return null;

  const tx = await SocialNetwork.connect(provider.getSigner()).createPost(
    preparedData.JSONURL,
    preparedData.userTags
  );
  await tx.wait();
  return tx;
};

export const commentPost = async (
  provider: ethers.providers.Web3Provider,
  content: string,
  targetPost: string
): Promise<null | SocialNetworkPost> => {
  if (content.length === 0) return null;
  if (!(await isValidPost(targetPost))) return null;

  const preparedData: any = await preparePost(content);
  if (!preparedData) return null;

  const tx = await SocialNetwork.connect(provider.getSigner()).commentPost(
    preparedData.JSONURL,
    preparedData.userTags,
    targetPost
  );
  await tx.wait();
  return tx;
};

export const sharePost = async (
  provider: ethers.providers.Web3Provider,
  content: string,
  targetPost: string
): Promise<null | SocialNetworkPost> => {
  if (content.length === 0) return null;
  if (!(await isValidPost(targetPost))) return null;

  const preparedData: any = await preparePost(content);
  if (!preparedData) return null;

  const tx = await SocialNetwork.connect(provider.getSigner()).sharePost(
    preparedData.JSONURL,
    preparedData.userTags,
    targetPost
  );
  await tx.wait();
  return tx;
};

const preparePost = async (content: string) => {
  if (content.length === 0) return null;

  const userTags = await getUserTags(content);
  const JSONURL = await uploadJSONToIPFSAndGetLSP2JSONURL({ content });

  return { userTags, JSONURL };
};
