// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";

/**
 * @title Social Network Profile Data Interface
 * @author Dennis Tuszynski
 * @dev Interface which describes the social network profile data that is 'assigned' to a universal profile.
 * Storing the data within a separate contract instead of in the universal profile itself has the following advantages:
 * - Prevention of data manipulation/corruption with manual 'setData' invocations by the universal profile owner, since only the managing SocialNetwork contract has write access
 * - Reduction of gas cost because of direct data manipulation by the owning SocialMedia contract instead of going through the KeyManager (especially 'verifyPermissions')
 * - Easier Onboarding of users since only a CALL permission with the SocialNetwork's contract address (ALLOWED ADDRESS) must be set on the universal profile's key manager
 * - Existence of a SocialNetworkProfileData contract instance is comparable with a successful registration
 * - (No validation modifiers necessary since validation is handled in managing SocialNetwork contract)
 */
interface ISocialNetworkProfileData is IERC165, IERC725Y {
       /**
     * @notice Returns the linked user profile of the profile data
     */
    function user() external view returns (address);

    /**
     * @notice Returns the timestamp of the post
     */
    function timestamp() external view returns (uint);

    /**
     * @notice Checks if the the social profile is tagged in the given post
     * @param _post address of the post to check
     */
    function isTaggedIn(address _post) external view returns (bool);

    /**
     * @notice Adds tag to social profile
     * @param _post address of the post to be added to the enumerable set 'tags'
     */
    function addTag(address _post) external;

    /**
     * @notice Checks if the the social profile is author of the given post
     * @param _post address of the post to check
     */
    function isAuthorOf(address _post) external view returns (bool);

    /**
     * @notice Adds post to social profile
     * @param _post address of the post to be added to the enumerable set 'posts'
     */
    function addPost(address _post) external;

    /**
     * @notice Checks if the given post is liked by the social profile
     * @param _post address of the post to check
     */
    function hasLiked(address _post) external view returns (bool);

    /**
     * @notice Adds post like to social profile (action: post liked by user)
     * @param _post address of the post to be added to the enumerable set 'likes'
     */
    function addLike(address _post) external;

    /**
     * @notice Removes post like from social profile (action: post unliked by user)
     * @param _post address of the post to be removed from the enumerable set 'likes'
     */
    function removeLike(address _post) external;

    /**
     * @notice Checks if the given user subscribed the social profile
     * @param _user address of the user to check
     */
    function isSubscribedBy(address _user) external view returns (bool);

    /**
     * @notice Adds subscriber to social profile
     * @param _user address of the user to be added to the enumerable set 'subscribers'
     */
    function addSubscriber(address _user) external;

    /**
     * @notice Removes subscriber from social profile
     * @param _user address of the user to be removed from the enumerable set 'subscribers'
     */
    function removeSubscriber(address _user) external;

    /**
     * @notice Checks if the the social profile subscribed the given user
     * @param _user address of the user to check
     */
    function isSubscriberOf(address _user) external view returns (bool);

    /**
     * @notice Adds subscription to social profile
     * @param _user address of the user to be added to the enumerable set 'subscriptions'
     */
    function addSubscription(address _user) external;

    /**
     * @notice Removes subscription from social profile
     * @param _user address of the user to be removed from the enumerable set 'subscriptions'
     */
    function removeSubscription(address _user) external;
}
