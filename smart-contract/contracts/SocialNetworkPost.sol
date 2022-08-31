// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

// local
import {ERC725YEnumerableSetUtil} from "./ERC725YEnumerableSetUtil.sol";
import {ISocialNetworkPost} from "./ISocialNetworkPost.sol";
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";

// constants
import "./SocialNetworkConstants.sol";

/**
 * @title Social Network Post Implementation
 * @author Dennis Tuszynski
 * @dev Contract module represents a social network post (LSP8 - Identifiable Asset).
 */
contract SocialNetworkPost is ISocialNetworkPost, ERC725YEnumerableSetUtil {
    uint public timestamp;
    address public author;
    SocialNetworkPostType public postType;
    address public referencedPost;

    /**
     * @notice Sets the contract variables and the ERC725Y JSONURL key that references the post content
     * @param _owner The owner address
     * @param _author address of the user who is the author of the post/share/comment
     * @param _postType post type enum value: STANDALONE (normal post), SHARE or COMMENT
     * @param _taggedUsers array of user addresses who are tagged in this post (max 3)
     * @param _data post content's json url formatted according to LSP2 JSONURL
     * @param _referencedPost if _postType is equal to STANDALONE then address(0) otherwise address of referenced post
     */
    constructor(
        address _owner,
        address _author,
        SocialNetworkPostType _postType,
        address[] memory _taggedUsers,
        bytes memory _data,
        address _referencedPost
    ) ERC725YEnumerableSetUtil(_owner) {
        require(
            _postType == SocialNetworkPostType.STANDALONE ||
                IERC165(_referencedPost).supportsInterface(
                    _INTERFACEID_SOCIAL_NETWORK_POST
                ),
            "Target post address must support the SOCIAL_NETWORK_POST interface (ERC165)"
        );
        require(_taggedUsers.length <= 3, "Amount of tagged users is greater than 3");
        if(_taggedUsers.length == 2){
            require(_taggedUsers[0] != _taggedUsers[1], "Tagged users must be different");
        }else if(_taggedUsers.length == 3){
            require(_taggedUsers[0] != _taggedUsers[1] && _taggedUsers[1] != _taggedUsers[2] && _taggedUsers[0] != _taggedUsers[2], "Tagged users must be different");
        }

        author = _author;
        postType = _postType;
        referencedPost = _postType == SocialNetworkPostType.STANDALONE
            ? address(0)
            : _referencedPost;
        timestamp = block.timestamp;

        // adds tagged users to ERC725Y based enumerable set
        uint taggedUserAmount = _taggedUsers.length;
        for (uint i = 0; i < taggedUserAmount; ++i) {
            addElementToEnumerableSet(
                _SN_USER_TAGS_MAP_KEY,
                _SN_USER_TAGS_ARRAY_KEY,
                _taggedUsers[i]
            );
        }

        setData(
            _LSP8_TOKEN_ID_METADATA_MINTED_BY,
            abi.encode(_author)
        );
        setData(
            _LSP8_TOKEN_ID_METADATA_TOKEN_ID,
            bytes.concat(bytes12(0), bytes20(address(this)))
        );
        setData(_LSP8_TOKEN_ID_METADATA_SN_POST_CONTENT, _data);
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function isUserTagged(address _user) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_USER_TAGS_MAP_KEY, _user);
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function isLikedBy(address _user) external view returns (bool) {
        return isAddressInEnumerableSet(_SN_LIKES_MAP_KEY, _user);
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function addLike(address _user) external onlyOwner {
        addElementToEnumerableSet(
            _SN_LIKES_MAP_KEY,
            _SN_LIKES_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function removeLike(address _user) external onlyOwner {
        removeElementFromEnumerableSet(
            _SN_LIKES_MAP_KEY,
            _SN_LIKES_ARRAY_KEY,
            _user
        );
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function addComment(address _comment) external onlyOwner {
        addElementToEnumerableSet(
            _SN_COMMENTS_MAP_KEY,
            _SN_COMMENTS_ARRAY_KEY,
            _comment
        );
    }

    /**
     * @inheritdoc ISocialNetworkPost
     */
    function addShare(address _share) external onlyOwner {
        addElementToEnumerableSet(
            _SN_SHARES_MAP_KEY,
            _SN_SHARES_ARRAY_KEY,
            _share
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
            interfaceId == _INTERFACEID_SOCIAL_NETWORK_POST ||
            super.supportsInterface(interfaceId);
    }
}
