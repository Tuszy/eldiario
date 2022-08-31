// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// local
import {SocialNetworkPost} from "./SocialNetworkPost.sol";
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";

/**
 * @title SocialNetworkPost contract instance factory
 * @author Dennis Tuszynski
 * @dev Generates instances of the SocialNetworkPost contract.
 */
library SocialNetworkPostFactory {
    /**
     * @notice Creates a new post of type STANDALONE
     * @param _owner The owning SocialNetwork contract instance
     * @param _author The user who created the post
     * @param _data The post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     */
    function createPost(
        address _owner,
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers
    ) public returns (address) {
        return
            address(
                new SocialNetworkPost(
                    _owner,
                    _author,
                    SocialNetworkPostType.STANDALONE,
                    _taggedUsers,
                    _data,
                    address(0)
                )
            );
    }

    /**
     * @notice Creates a new post of type COMMENT
     * @param _owner The owning SocialNetwork contract instance
     * @param _author The user who created the comment
     * @param _data The comment post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     * @param _targetPost The commented post
     */
    function createCommentPost(
        address _owner,
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    ) public returns (address) {
        return
            address(
                new SocialNetworkPost(
                    _owner,
                    _author,
                    SocialNetworkPostType.COMMENT,
                    _taggedUsers,
                    _data,
                    _targetPost
                )
            );
    }

    /**
     * @notice Creates a new post of type SHARE
     * @param _owner The owning SocialNetwork contract instance
     * @param _author The user who created the share
     * @param _data The share post content data (LSP2 JSONURL)
     * @param _taggedUsers The array of tagged users (optional)
     * @param _targetPost The shared post
     */
    function createSharePost(
        address _owner,
        address _author,
        bytes calldata _data,
        address[] calldata _taggedUsers,
        address _targetPost
    ) public returns (address) {
        return
            address(
                new SocialNetworkPost(
                    _owner,
                    _author,
                    SocialNetworkPostType.SHARE,
                    _taggedUsers,
                    _data,
                    _targetPost
                )
            );
    }
}
