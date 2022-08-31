// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {_INTERFACEID_ERC725Y, _INTERFACEID_ERC725X} from "@erc725/smart-contracts/contracts/constants.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {OwnableUnset} from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";

// local
import {ISocialNetwork} from "./ISocialNetwork.sol";
import {SocialNetworkProfileDataFactory} from "./SocialNetworkProfileDataFactory.sol";
import {ISocialNetworkProfileData} from "./ISocialNetworkProfileData.sol";
import {SocialNetworkPostFactory} from "./SocialNetworkPostFactory.sol";
import {ISocialNetworkPost} from "./ISocialNetworkPost.sol";
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";

// constants
import "./SocialNetworkConstants.sol";

/**
 * @title Social Network Implementation
 * @author Dennis Tuszynski
 * @dev Contract module represents a social network.
 */
contract SocialNetwork is
    ISocialNetwork,
    LSP8IdentifiableDigitalAsset("Social Network Post", "SNP", msg.sender)
{
    mapping(address => address) public registeredUsers; // mapping from universal profile to social network profile data
    uint public registeredUserCount = 0; // incremented with each registration

    constructor(bytes memory _LSP4MetadataJSONURL) {
        // set token id type to be address (tokens => instances of SocialNetworkPost contract)
        setData(
            _LSP8_TOKEN_ID_TYPE,
            bytes(abi.encode(_LSP8_TOKEN_ID_TYPE_ADDRESS))
        );
        setData(_LSP4_METADATA_KEY, _LSP4MetadataJSONURL);
    }

    /**
     * @notice Validates that the given address is a registered user
     * @param _user the user address to be checked
     */
    modifier onlyRegisteredUser(address _user) {
        require(
            registeredUsers[_user] != address(0),
            "User address is not registered"
        );
        _;
    }

    /**
     * @notice Validates that the given address is a valid post (instance of SocialNetworkPost contract)
     * @param _post the post address to be checked
     */
    modifier onlyValidPost(address _post) {
        require(
            IERC165(_post).supportsInterface(_INTERFACEID_SOCIAL_NETWORK_POST),
            "Post address is not pointing to a valid post (SocialNetworkPost interface not available)"
        );
        require(
            OwnableUnset(_post).owner() == address(this),
            "Post address is not owned by current SocialNetwork contract instance"
        );
        _;
    }

    /**
     * @notice Validates that the user has liked the post
     * @param _user the address of the user
     * @param _targetPost the address of the post
     */
    modifier onlyLikedPost(address _user, address _targetPost) {
        require(
            ISocialNetworkPost(_targetPost).isLikedBy(_user),
            "User did not like the post yet"
        );
        _;
    }

    /**
     * @notice Validates that the user has not liked the post
     * @param _user the address of the user
     * @param _targetPost the address of the post
     */
    modifier onlyNotLikedPost(address _user, address _targetPost) {
        require(
            !ISocialNetworkPost(_targetPost).isLikedBy(_user),
            "User has already liked the post"
        );
        _;
    }

    /**
     * @notice Validates that the user has subscribed the target user
     * @param _user the address of the user
     * @param _targetUser the address of the target user
     */
    modifier onlySubscribedUser(address _user, address _targetUser) {
        require(_user != _targetUser, "Users must be different");
        require(
            ISocialNetworkProfileData(registeredUsers[_user]).isSubscriberOf(
                _targetUser
            ),
            "User is not a subscriber yet"
        );
        _;
    }

    /**
     * @notice Validates that the user has not subscribed the target user
     * @param _user the address of the user
     * @param _targetUser the address of the target user
     */
    modifier onlyNotSubscribedUser(address _user, address _targetUser) {
        require(_user != _targetUser, "Users must be different");
        require(
            !ISocialNetworkProfileData(registeredUsers[_user]).isSubscriberOf(
                _targetUser
            ),
            "User is already a subscriber"
        );
        _;
    }

    /**
     * @notice Validates that the user is the author of the post
     * @param _user the address of the user
     * @param _targetPost the address of the post
     */
    modifier onlyPostAuthor(address _user, address _targetPost) {
        require(
            _user == ISocialNetworkPost(_targetPost).author(),
            "User must be the post author"
        );
        _;
    }

    /**
     * @notice Requires that the user is not the author of the post
     * @param _user the address of the user
     * @param _targetPost the address of the post
     */
    modifier onlyNotPostAuthor(address _user, address _targetPost) {
        require(
            _user != ISocialNetworkPost(_targetPost).author(),
            "User must not be the post author"
        );
        _;
    }

    /**
     * @inheritdoc ISocialNetwork
     * @dev Creates a new instance of the SocialNetworkProfileData contract and links it to the sender address.
     * Fails if the sender address is not a universal profile or if the sender address is already registered.
     */
    function register() external returns (address) {
        require(
            registeredUsers[msg.sender] == address(0),
            "User address is already registered"
        );
        require(
            msg.sender.code.length > 0,
            "User address is an EOA - Only smart contract based accounts are supported"
        );
        require(
            IERC165(msg.sender).supportsInterface(_INTERFACEID_ERC725Y) &&
                IERC165(msg.sender).supportsInterface(_INTERFACEID_ERC725X),
            "User address is not an universal profile (ERC725X and/or ERC725Y interfaces not available)"
        );

        ++registeredUserCount;
        registeredUsers[msg.sender] = SocialNetworkProfileDataFactory
            .createProfileData(address(this), msg.sender);
        emit UserRegistered(
            msg.sender,
            registeredUsers[msg.sender],
            registeredUserCount,
            block.timestamp
        );

        return registeredUsers[msg.sender];
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function likePost(address _post)
        external
        onlyRegisteredUser(msg.sender)
        onlyValidPost(_post)
        onlyNotPostAuthor(msg.sender, _post)
        onlyNotLikedPost(msg.sender, _post)
    {
        ISocialNetworkPost(_post).addLike(msg.sender);
        ISocialNetworkProfileData(registeredUsers[msg.sender]).addLike(_post);
        emit UserLikedPost(msg.sender, _post, block.timestamp);
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function unlikePost(address _post)
        external
        onlyRegisteredUser(msg.sender)
        onlyValidPost(_post)
        onlyNotPostAuthor(msg.sender, _post)
        onlyLikedPost(msg.sender, _post)
    {
        ISocialNetworkPost(_post).removeLike(msg.sender);
        ISocialNetworkProfileData(registeredUsers[msg.sender]).removeLike(
            _post
        );
        emit UserUnlikedPost(msg.sender, _post, block.timestamp);
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function subscribeUser(address _user)
        external
        onlyRegisteredUser(msg.sender)
        onlyRegisteredUser(_user)
        onlyNotSubscribedUser(msg.sender, _user)
    {
        ISocialNetworkProfileData(registeredUsers[msg.sender]).addSubscription(
            _user
        );
        ISocialNetworkProfileData(registeredUsers[_user]).addSubscriber(
            msg.sender
        );
        emit UserSubscribedUser(msg.sender, _user, block.timestamp);
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function unsubscribeUser(address _user)
        external
        onlyRegisteredUser(msg.sender)
        onlyRegisteredUser(_user)
        onlySubscribedUser(msg.sender, _user)
    {
        ISocialNetworkProfileData(registeredUsers[msg.sender])
            .removeSubscription(_user);
        ISocialNetworkProfileData(registeredUsers[_user]).removeSubscriber(
            msg.sender
        );
        emit UserUnsubscribedUser(msg.sender, _user, block.timestamp);
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function createPost(bytes calldata _data, address[] calldata _taggedUsers)
        external
        onlyRegisteredUser(msg.sender)
        returns (address)
    {
        address post = SocialNetworkPostFactory.createPost(
            address(this),
            msg.sender,
            _data,
            _taggedUsers
        );

        _mint(
            msg.sender,
            bytes32(bytes.concat(bytes12(0), bytes20(post))),
            false,
            ""
        );

        ISocialNetworkProfileData(registeredUsers[msg.sender]).addPost(post);

        emit UserCreatedPost(SocialNetworkPostType.STANDALONE, msg.sender, address(0), post, block.timestamp);
        handleUserTags(post, _taggedUsers);

        return post;
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function commentPost(
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    )
        external
        onlyRegisteredUser(msg.sender)
        onlyValidPost(_targetPost)
        returns (address)
    {
        address post = SocialNetworkPostFactory.createCommentPost(
            address(this),
            msg.sender,
            _data,
            _taggedUsers,
            _targetPost
        );

        _mint(
            msg.sender,
            bytes32(bytes.concat(bytes12(0), bytes20(post))),
            false,
            ""
        );

        ISocialNetworkPost(_targetPost).addComment(post);
        ISocialNetworkProfileData(registeredUsers[msg.sender]).addPost(post);

        emit UserCreatedPost(SocialNetworkPostType.COMMENT, msg.sender, _targetPost, post, block.timestamp);
        handleUserTags(post, _taggedUsers);

        return post;
    }

    /**
     * @inheritdoc ISocialNetwork
     */
    function sharePost(
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    )
        external
        onlyRegisteredUser(msg.sender)
        onlyValidPost(_targetPost)
        returns (address)
    {
        address post = SocialNetworkPostFactory.createSharePost(
            address(this),
            msg.sender,
            _data,
            _taggedUsers,
            _targetPost
        );

        _mint(
            msg.sender,
            bytes32(bytes.concat(bytes12(0), bytes20(post))),
            false,
            ""
        );

        ISocialNetworkPost(_targetPost).addShare(post);
        ISocialNetworkProfileData(registeredUsers[msg.sender]).addPost(post);

        emit UserCreatedPost(SocialNetworkPostType.SHARE, msg.sender, _targetPost, post, block.timestamp);
        handleUserTags(post, _taggedUsers);

        return post;
    }

    /**
     * @notice Emits UserTaggedUserInPost events and adds the given post to the according enumerable set of each user's social profile data contract instance.
     * @param _post The post in which the users were tagged
     * @param _taggedUsers The array of the users who were tagged
     */
    function handleUserTags(address _post, address[] calldata _taggedUsers)
        internal
    {
        uint taggedUsersLength = _taggedUsers.length;
        for (uint i = 0; i < taggedUsersLength; ++i) {
            handleUserTag(_post, _taggedUsers[i]);
        }
    }

    /**
     * @notice Emits UserTaggedUserInPost event and adds the given post to the according enumerable set of the user's social profile data contract instance.
     * @param _post The post in which the user was tagged
     * @param _taggedUser The address of the user who was tagged
     */
    function handleUserTag(address _post, address _taggedUser)
        internal
        onlyRegisteredUser(_taggedUser)
    {
        ISocialNetworkProfileData(registeredUsers[_taggedUser]).addTag(_post);

        emit UserTaggedUserInPost(
            msg.sender,
            _post,
            _taggedUser,
            block.timestamp
        );
    }

    /**
     * @inheritdoc ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, LSP8IdentifiableDigitalAsset)
        returns (bool)
    {
        return
            interfaceId == _INTERFACEID_SOCIAL_NETWORK ||
            super.supportsInterface(interfaceId);
    }
}
