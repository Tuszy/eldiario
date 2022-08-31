// Types
import type { Link } from "./Link";
import type { Image } from "./Image";
import type { SocialProfileStats } from "./SocialProfileStats";

export interface SocialNetworkProfile {
  address: string;
  name: string;
  description: string;
  profileImage: Image[];
  backgroundImage: Image[];
  tags: string[];
  links: Link[];
  socialProfileStats: null | SocialProfileStats;
}
