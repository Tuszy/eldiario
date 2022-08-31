// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

/**
 * @title Custom LSP2 utils library: https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-2-ERC725YJSONSchema.md
 * @author Dennis Tuszynski
 * @dev Implementation of a library which adds some custom helper functions for calculating LSP2 conforming key names.
 */
library LSP2KeyUtil {
     /**
     * @notice Calculates LSP2 conforming key name for mapping type
     * @param _mapKeyNamePrefix the LSP2 conforming mapping key name prefix
     * @param _address the address to be used as the key name suffix (mapped address)
     */
    function getMappedAddressKeyName(bytes12 _mapKeyNamePrefix, address _address) external pure returns (bytes32) {
        return bytes32(bytes.concat(_mapKeyNamePrefix, bytes20(_address)));
    }
}