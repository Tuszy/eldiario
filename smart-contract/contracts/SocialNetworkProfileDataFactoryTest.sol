// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// local
import {SocialNetworkProfileData} from "./SocialNetworkProfileData.sol";
import {SocialNetworkProfileDataFactory} from "./SocialNetworkProfileDataFactory.sol";

/**
 * @title SocialNetworkProfileDataFactoryTest contract
 * @author Dennis Tuszynski
 * @dev Used to test the SocialNetworkProfileDataFactory library
 */
contract SocialNetworkProfileDataFactoryTest {
    /**
     * @dev Emitted when a new SocialNetworkProfileData contract instance was created (used for testing since return values from tx cannot be read)
     * @param user The address of the user the profile data was created for
     * @param newProfileData The address of the profile data that was created
     */
    event CreatedProfileData(
        address indexed user,
        address indexed newProfileData
    );

    /**
     * @notice Calls createProfileData of the SocialNetworkProfileDataFactory library
     * @param _user The user who is linked to the profile data (assignment)
     */
    function createProfileData(address _user)
        public
        returns (address)
    {
        address profileData = SocialNetworkProfileDataFactory.createProfileData(address(this), _user);
        emit CreatedProfileData(_user, profileData);
        return profileData;
    }
}
