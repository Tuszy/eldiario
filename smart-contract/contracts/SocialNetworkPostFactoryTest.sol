// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// local
import {SocialNetworkPost} from "./SocialNetworkPost.sol";
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";
import {SocialNetworkPostFactory} from "./SocialNetworkPostFactory.sol";

/**
 * @title SocialNetworkPostFactoryTest contract
 * @author Dennis Tuszynski
 * @dev Used to test the SocialNetworkPostFactory library
 */
contract SocialNetworkPostFactoryTest {
    /**
     * @dev Emitted when a new SocialNetworkPost contract instance was created (used for testing since return values from tx cannot be read)
     * @param author The address of the user the post was created by
     * @param newPost The address of the post that was created
     */
    event CreatedPost(address indexed author, address indexed newPost);

    /**
     * @notice Calls createPost of the SocialNetworkPostFactory library
     * @param _author The user who created the post
     * @param _data The post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     */
    function createPost(
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers
    ) external returns (address) {
        address post = SocialNetworkPostFactory.createPost(address(this), _author, _data, _taggedUsers);
        emit CreatedPost(_author, post);
        return post;
    }

    /**
     * @notice Calls createCommentPost of the SocialNetworkPostFactory library
     * @param _author The user who created the comment
     * @param _data The comment post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     * @param _referencedPost The commented post
     */
    function createCommentPost(
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _referencedPost
    ) external returns (address) {
        address post = SocialNetworkPostFactory.createCommentPost(address(this), _author, _data, _taggedUsers, _referencedPost);
        emit CreatedPost(_author, post);
        return post;
    }

    /**
     * @notice Calls createSharePost of the SocialNetworkPostFactory library
     * @param _author The user who created the share
     * @param _data The share post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     * @param _referencedPost The shared post
     */
    function createSharePost(
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _referencedPost
    ) external returns (address) {
        address post = SocialNetworkPostFactory.createSharePost(address(this), _author, _data, _taggedUsers, _referencedPost);
        emit CreatedPost(_author, post);
        return post;
    }
}
