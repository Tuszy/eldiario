# El Diario
Decentralized social media feed powered by the LUKSO blockchain.

| Name | Description |
| ---- | ----------- |
| Project | El Diario |
| Name | Dennis Tuszynski |
| Email | denniro@gmail.com |
| App | https://el-diar.io |
| Frontend | [frontend](https://github.com/Tuszy/eldiario/tree/main/frontend) |
| Contracts | [contracts](https://github.com/Tuszy/eldiario/tree/main/smart-contract) |

Video:

[Demo Video](https://el-diar.io)
# Functional Overview

- register profile
- view profile (registered + unregistered)
- view created posts
- view comments
- view shares
- view subscribers
- view subscriptions
- view user likes
- view post likes
- un/subscribe profile
- un/like post
- create post
- comment post
- share post
- tag up to 3 users in a post

# Technical Overview
Idea:
1. SocialNetwork is a NFT smart contract (LSP8) with extended functionality.
2. Each created post is a NFT (LSP8) and represented by a SocialNetworkPost smart contract instance.
3. Each registered profile is represented by a SocialNetworkProfileData smart contract instance


Smart Contracts:

- SocialNetwork smart contract: Extends LSP8 + contains all functions (un/subscribing profiles, un/liking posts, creating/commenting/sharing posts, tagging users...)
- SocialNetworkProfileData smart contract: Extends ERC725Y + Represents registered profile with all the necessary data (liked posts, created posts, subscribers, subscriptions...)
- SocialNetworkPost smart contract: Extends ERC725Y + Represents LSP8 token metadata contract for NFTs created by SocialNetwork instance (id => address of unique SocialNetworkPost instance) + Represents created post with all the necessary data (likes, comments, shares, content...) 
# Future Tasks

- Complete Redesign + UX Improvement
- Integrate transaction relaying [backend](https://github.com/Tuszy/eldiario/tree/main/backend) (unfortunately did not manage to finish it on time...)