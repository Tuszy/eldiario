// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// local
import {SocialNetworkProfileData} from "./SocialNetworkProfileData.sol";

/**
 * @title SocialNetworkProfileData contract instance factory
 * @author Dennis Tuszynski
 * @dev Generates instances of the SocialNetworkProfileData contract
 */
library SocialNetworkProfileDataFactory {
    /**
     * @notice Creates a new social network profile data contract instance
     * @param _owner The owning SocialNetwork contract instance
     * @param _user The user who is linked to the profile data (assignment)
     */
    function createProfileData(
        address _owner,
        address _user
    ) public returns (address) {
        return
            address(
                new SocialNetworkProfileData(
                    _owner,
                    _user
                )
            );
    }
}
