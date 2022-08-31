// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";

// local
import {SocialNetworkPostType} from "./SocialNetworkPostType.sol";

/**
 * @title Social Network Post Interface
 * @author Dennis Tuszynski
 * @dev Interface which describes all the function declarations for a SocialNetworkPost contract (LSP8 Token instance).
 */
interface ISocialNetworkPost is IERC165, IERC725Y {
    /**
     * @notice Returns the author of the post
     */
    function author() external view returns (address);

    /**
     * @notice Returns the timestamp of the post
     */
    function timestamp() external view returns (uint);

    /**
     * @notice Returns the type of the post
     */
    function postType() external view returns (SocialNetworkPostType);

    /**
     * @notice Returns the referencedPost of the post
     */
    function referencedPost() external view returns (address);
    
    /**
     * @notice Checks if the given user is tagged in the post
     * @param _user address of the user to check
     */
    function isUserTagged(address _user) external view returns (bool);


    /**
     * @notice Checks if the given user liked the post
     * @param _user address of the user to check
     */
    function isLikedBy(address _user) external view returns (bool);

    /**
     * @notice Adds user like to post
     * @param _user address of the user to be added to the enumerable set 'likes'
     */
    function addLike(address _user) external;

    /**
     * @notice Removes user like from post
     * @param _user address of the user to be removed from the enumerable set 'likes'
     */
    function removeLike(address _user) external;

    /**
     * @notice Adds comment to post
     * @param _comment address of the post to be added to the enumerable set 'comments'
     */
    function addComment(address _comment) external;

    /**
     * @notice Adds share to post
     * @param _share address of the post to be added to the enumerable set 'shares'
     */
    function addShare(address _share) external;
}
