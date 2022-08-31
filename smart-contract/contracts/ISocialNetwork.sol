// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {ILSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/ILSP8IdentifiableDigitalAsset.sol";

// local
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";

/**
 * @title Social Network Interface
 * @author Dennis Tuszynski
 * @dev Interface which describes all the necessary events and function declarations for a SocialNetwork contract.
 */
interface ISocialNetwork is ILSP8IdentifiableDigitalAsset {
    /**
     * @dev Emitted when `user` registered and linked to `socialProfileData`
     * @param user The address of the user who registered
     * @param socialProfileData The address of the deployed SocialNetworkProfileData contract address assigned to the `user`
     * @param userNumber The number of the user (incremented with each registration)
     * @param timestamp timestamp of the event
     */
    event UserRegistered(
        address indexed user,
        address indexed socialProfileData,
        uint indexed userNumber,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` liked `targetPost`
     * @param user The address of the user who liked
     * @param targetPost The address of the social network post that was liked
     * @param timestamp timestamp of the event
     */
    event UserLikedPost(
        address indexed user,
        address indexed targetPost,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` unliked `targetPost`
     * @param user The address of the user who liked
     * @param targetPost The address of the social network post that was unliked
     * @param timestamp timestamp of the event
     */
    event UserUnlikedPost(
        address indexed user,
        address indexed targetPost,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` subscribed `targetUser`
     * @param user The address of the user who subscribed
     * @param targetUser The address of the user who was subscribed
     * @param timestamp timestamp of the event
     */
    event UserSubscribedUser(
        address indexed user,
        address indexed targetUser,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` unsubscribed `targetUser`
     * @param user The address of the user who unsubscribed
     * @param targetUser The address of the user who was unsubscribed
     * @param timestamp timestamp of the event
     */
    event UserUnsubscribedUser(
        address indexed user,
        address indexed targetUser,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` created `newPost`. If new post is a comment or share then 'targetPost' contains the targeted post address.
     * @param postType The type of the post that was created (standalone, comment or share)
     * @param user The address of the user who created
     * @param newPost The address of the post that was created
     * @param targetPost The address of the post that was targeted (mandatory for comment and share)
     * @param timestamp timestamp of the event
     */
    event UserCreatedPost(
        SocialNetworkPostType indexed postType,
        address indexed user,
        address indexed targetPost,
        address newPost,
        uint timestamp
    );

    /**
     * @dev Emitted when `user` tagged a `targetUser` in a `newPost`
     * @param user The address of the user who tagged
     * @param newPost The address of the post in which the `targetUser` was tagged
     * @param targetUser The address of the target user who was tagged
     * @param timestamp timestamp of the event
     */
    event UserTaggedUserInPost(
        address indexed user,
        address indexed newPost,
        address indexed targetUser,
        uint timestamp
    );

    /**
     * @notice Registers a new user (msg.sender)
     */
    function register() external returns (address);

    /**
     * @notice User (msg.sender) likes a post
     * @param _post The post to be liked
     */
    function likePost(address _post) external;

    /**
     * @notice User (msg.sender) unlikes a post
     * @param _post The post to be unliked
     */
    function unlikePost(address _post) external;

    /**
     * @notice User (msg.sender) subscribes an other user
     * @param _user The user to be subscribed
     */
    function subscribeUser(address _user) external;

    /**
     * @notice User (msg.sender) unsubscribes an other user
     * @param _user The user to be unsubscribed
     */
    function unsubscribeUser(address _user) external;

    /**
     * @notice User (msg.sender) creates a post
     * @param _data The post content data
     * @param _taggedUsers An array of tagged users (optional)
     */
    function createPost(bytes calldata _data, address[] calldata _taggedUsers)
        external
        returns (address);

    /**
     * @notice User (msg.sender) comments a post
     * @param _data The comment post content data
     * @param _taggedUsers An array of tagged users (optional)
     * @param _targetPost The commented post
     */
    function commentPost(
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    ) external returns (address);

    /**
     * @notice User (msg.sender) shares a post with a comment
     * @param _data The comment post content data
     * @param _taggedUsers An array of tagged users (optional)
     * @param _targetPost The shared post
     */
    function sharePost(
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    ) external returns (address);
}
