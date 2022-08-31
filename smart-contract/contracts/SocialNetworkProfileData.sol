// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

// local
import {ERC725YEnumerableSetUtil} from "./ERC725YEnumerableSetUtil.sol";
import {ISocialNetworkProfileData} from "./ISocialNetworkProfileData.sol";

// constants
import "./SocialNetworkConstants.sol";

/**
 * @title Social Network Profile Data Implementation
 * @author Dennis Tuszynski
 * @dev Contract module represents the social network profile data which is 'assigned' to a universal profile.
 * Storing the data within a separate contract instead of in the universal profile itself has the following advantages:
 * - Prevention of data manipulation/corruption with manual 'setData' invocations by the universal profile owner, since only the managing SocialNetwork contract has write access
 * - Reduction of gas cost because of direct data manipulation by the owning SocialMedia contract instead of going through the KeyManager (especially 'verifyPermissions')
 * - Easier Onboarding of users since only a CALL permission with the SocialNetwork's contract address (ALLOWED ADDRESS) must be set on the universal profile's key manager
 * - Existence of a SocialNetworkProfileData contract instance is comparable with a successful registration
 * - (No validation modifiers necessary since validation is handled in managing SocialNetwork contract)
 */
contract SocialNetworkProfileData is
    ISocialNetworkProfileData,
    ERC725YEnumerableSetUtil
{
    address public user; // Universal profile
    uint public timestamp;

    /**
     * @notice Sets the contract variables
     * @param _owner The owner address
     * @param _user address of the user who is linked to the social network profile data
     */
    constructor(address _owner, address _user)
        ERC725YEnumerableSetUtil(_owner)
    {
        user = _user;
        timestamp = block.timestamp;
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function isTaggedIn(address _post) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_USER_TAGS_MAP_KEY, _post);
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function addTag(address _post) external onlyOwner {
        addElementToEnumerableSet(
            _SN_USER_TAGS_MAP_KEY,
            _SN_USER_TAGS_ARRAY_KEY,
            _post
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function isAuthorOf(address _post) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_POSTS_MAP_KEY, _post);
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function addPost(address _post) external onlyOwner {
        addElementToEnumerableSet(
            _SN_POSTS_MAP_KEY,
            _SN_POSTS_ARRAY_KEY,
            _post
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function hasLiked(address _post) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_LIKES_MAP_KEY, _post);
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function addLike(address _post) external onlyOwner {
        addElementToEnumerableSet(
            _SN_LIKES_MAP_KEY,
            _SN_LIKES_ARRAY_KEY,
            _post
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function removeLike(address _post) external onlyOwner {
        removeElementFromEnumerableSet(
            _SN_LIKES_MAP_KEY,
            _SN_LIKES_ARRAY_KEY,
            _post
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function isSubscribedBy(address _user) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_SUBSCRIBERS_MAP_KEY, _user);
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function addSubscriber(address _user) external onlyOwner {
        addElementToEnumerableSet(
            _SN_SUBSCRIBERS_MAP_KEY,
            _SN_SUBSCRIBERS_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function removeSubscriber(address _user) external onlyOwner {
        removeElementFromEnumerableSet(
            _SN_SUBSCRIBERS_MAP_KEY,
            _SN_SUBSCRIBERS_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function isSubscriberOf(address _user) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_SUBSCRIPTIONS_MAP_KEY, _user);
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function addSubscription(address _user) external onlyOwner {
        addElementToEnumerableSet(
            _SN_SUBSCRIPTIONS_MAP_KEY,
            _SN_SUBSCRIPTIONS_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ISocialNetworkProfileData
     */
    function removeSubscription(address _user) external onlyOwner {
        removeElementFromEnumerableSet(
            _SN_SUBSCRIPTIONS_MAP_KEY,
            _SN_SUBSCRIPTIONS_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC725YCore)
        returns (bool)
    {
        return
            interfaceId == _INTERFACEID_SOCIAL_NETWORK_PROFILE_DATA ||
            super.supportsInterface(interfaceId);
    }
}
