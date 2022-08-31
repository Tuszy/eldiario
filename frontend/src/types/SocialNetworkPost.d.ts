// Crypto
import { ethers } from "ethers";
import ERC725 from "@erc725/erc725.js";

enum PostType {
  STANDALONE = 0,
  COMMENT = 1,
  SHARE = 2,
}

export interface SocialNetworkPostStats {
  likes: number;
  shares: number;
  comments: number;
}
export type SocialNetworkPost = SocialNetworkPostStats & {
  address: string;
  author: string;
  content: string;
  taggedUsers: string[];
  referencedPost?: string;
  timestamp: Date;
  type: PostType;
}


