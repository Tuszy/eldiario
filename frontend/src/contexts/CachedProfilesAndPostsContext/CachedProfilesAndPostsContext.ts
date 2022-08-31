// React
import React, { createContext } from "react";

// Types
import type { SocialNetworkProfile } from "../../types/SocialNetworkProfile";
import type { SocialNetworkPost } from "./../../types/SocialNetworkPost.d";

export interface CachedProfilesAndPostsContextValue {
  getProfile: (
    address: string,
    ignoreCache?: boolean
  ) => Promise<null | SocialNetworkProfile>;
  getPost: (
    address: string,
    ignoreCache?: boolean
  ) => Promise<null | SocialNetworkPost>;
  getProfileFromCache: (address: string) => null | SocialNetworkProfile;
  getPostFromCache: (address: string) => null | SocialNetworkPost;
  resetAll: () => void;
  resetPosts: () => void;
  resetProfiles: () => void;
  refetchAll: () => Promise<void>;
  refetchPosts: () => Promise<void>;
  refetchProfiles: () => Promise<void>;
}

const CachedProfilesAndPostsContext =
  createContext<CachedProfilesAndPostsContextValue>({
    getProfile: async () => null,
    getPost: async () => null,
    getProfileFromCache: () => null,
    getPostFromCache: () => null,
    resetAll: () => {},
    resetPosts: () => {},
    resetProfiles: () => {},
    refetchAll: async () => {},
    refetchPosts: async () => {},
    refetchProfiles: async () => {},
  });

export default CachedProfilesAndPostsContext;
