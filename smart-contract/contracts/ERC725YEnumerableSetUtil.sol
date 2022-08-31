// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// third party
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {LSP2Utils} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";

// local
import {LSP2KeyUtil} from "./LSP2KeyUtil.sol";

/**
 * @title ERC725Y based implementation of an EnumerableSet for addresses: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/structs/EnumerableSet.sol
 * @author Dennis Tuszynski
 * @dev Implementation of a contract which provides the ability to treat 2 ERC725Y Keys (Map and Key) as an enumerable set.
 * It allows you to add an entry, remove an entry, check for existence of a given entry and retrieve the total count of entries.
 */
contract ERC725YEnumerableSetUtil is ERC725Y {
    using LSP2KeyUtil for bytes12;

    /**
     * @notice Sets the ERC725Y owner
     * @param _owner The owner address
     */
    constructor(address _owner) ERC725Y(_owner) {}

    /**
     * @notice Adds the given address to the specified enumerable set
     * @param _mapKeyNamePrefix the LSP2 conforming mapping key name prefix of the ERC725Y enumerable set
     * @param _arrayKeyName the LSP2 conforming array key name of the ERC725Y enumerable set
     * @param _address the element to be added to the enumerable set
     */
    function addElementToEnumerableSet(
        bytes12 _mapKeyNamePrefix,
        bytes32 _arrayKeyName,
        address _address
    ) public returns (bool) {
        // if the address is already in the enumerable set then return immediately to save gas cost
        uint index = getAddressIndexInEnumerableSet(
            _mapKeyNamePrefix,
            _address
        );
        if (index != 0) {
            return false;
        }

        bytes32 indexKeyName = _mapKeyNamePrefix.getMappedAddressKeyName(
            _address
        );

        bytes memory arrayLengthData = getData(_arrayKeyName);
        uint arrayLength = 0;
        if (arrayLengthData.length > 0) {
            arrayLength = abi.decode(arrayLengthData, (uint));
        }

        uint newEntryIndex = arrayLength + 1; // 0 is sentinel value (array starts with 1)
        bytes32 newEntryAdressKeyName = LSP2Utils
            .generateArrayElementKeyAtIndex(_arrayKeyName, newEntryIndex);

        bytes32[] memory keys = new bytes32[](3);
        bytes[] memory values = new bytes[](3);

        keys[0] = indexKeyName;
        values[0] = bytes(abi.encode(newEntryIndex));

        keys[1] = _arrayKeyName; // array length equals last element index
        values[1] = bytes(abi.encode(newEntryIndex));

        keys[2] = newEntryAdressKeyName;
        values[2] = bytes(abi.encode(_address));

        setData(keys, values);

        return true;
    }

    /**
     * @notice Removes the given address from the specified enumerable set
     * @param _mapKeyNamePrefix the LSP2 conforming mapping key name prefix of the ERC725Y enumerable set
     * @param _arrayKeyName the LSP2 conforming array key name of the ERC725Y enumerable set
     * @param _address the element to be removed from the enumerable set
     */
    function removeElementFromEnumerableSet(
        bytes12 _mapKeyNamePrefix,
        bytes32 _arrayKeyName,
        address _address
    ) public returns (bool) {
        // if the address is not in the enumerable set then return immediately to save gas cost
        uint entryToDeleteIndex = getAddressIndexInEnumerableSet(
            _mapKeyNamePrefix,
            _address
        );
        if (entryToDeleteIndex == 0) {
            return false;
        }

        bytes32 entryToDeleteIndexKeyName = _mapKeyNamePrefix
            .getMappedAddressKeyName(_address);

        bytes32 addressToDeleteKeyName = LSP2Utils
            .generateArrayElementKeyAtIndex(_arrayKeyName, entryToDeleteIndex);

        uint arrayLength = abi.decode(getData(_arrayKeyName), (uint));
        bytes32 lastAddressKeyName = LSP2Utils.generateArrayElementKeyAtIndex(
            _arrayKeyName,
            arrayLength
        );

        bytes32[] memory keys;
        bytes[] memory values;
        uint indexCounter = 0;

        if (entryToDeleteIndex != arrayLength) {
            keys = new bytes32[](5);
            values = new bytes[](5);

            address entryToMoveAddress = abi.decode(
                getData(lastAddressKeyName),
                (address)
            );
            bytes32 entryToMoveIndexKeyName = _mapKeyNamePrefix
                .getMappedAddressKeyName(entryToMoveAddress);

            keys[indexCounter] = addressToDeleteKeyName; // values[<delete index>] = values[<move index>]
            values[indexCounter] = bytes(abi.encode(entryToMoveAddress));
            ++indexCounter;

            keys[indexCounter] = entryToMoveIndexKeyName; // indexes[<move address>] = indexes[<delete address>]
            values[indexCounter] = bytes(abi.encode(entryToDeleteIndex));
            ++indexCounter;
        } else {
            keys = new bytes32[](3);
            values = new bytes[](3);
        }

        keys[indexCounter] = entryToDeleteIndexKeyName; // delete from map
        values[indexCounter] = new bytes(0);
        ++indexCounter;

        keys[indexCounter] = lastAddressKeyName; // delete from array (last element)
        values[indexCounter] = new bytes(0);
        ++indexCounter;

        keys[indexCounter] = _arrayKeyName; // array length decreased by one
        if (arrayLength > 1) {
            values[indexCounter] = bytes(abi.encode(arrayLength - 1));
        } else {
            values[indexCounter] = new bytes(0);
        }

        setData(keys, values);

        return true;
    }

    /**
     * @notice Returns the index if the given address is in the specified enumerable set
     * @param _mapKeyNamePrefix the LSP2 conforming mapping key name prefix of the ERC725Y enumerable set
     * @param _address the element to be checked for existence in the enumerable set
     */
    function getAddressIndexInEnumerableSet(
        bytes12 _mapKeyNamePrefix,
        address _address
    ) public view returns (uint) {
        bytes32 indexKeyName = _mapKeyNamePrefix.getMappedAddressKeyName(
            _address
        );

        bytes memory addressIndexData = getData(indexKeyName);
        if (addressIndexData.length == 0) {
            return 0;
        }

        uint index = abi.decode(addressIndexData, (uint));
        return index;
    }

    /**
     * @notice Checks if the given address is in the specified enumerable set
     * @param _mapKeyNamePrefix the LSP2 conforming mapping key name prefix of the ERC725Y enumerable set
     * @param _address the element to be checked for existence in the enumerable set
     */
    function isAddressInEnumerableSet(
        bytes12 _mapKeyNamePrefix,
        address _address
    ) public view returns (bool) {
        return getAddressIndexInEnumerableSet(_mapKeyNamePrefix, _address) != 0;
    }

    /**
     * @notice Returns the total count of entries in the enumerable set
     * @param _arrayKeyName the LSP2 conforming array key name of the ERC725Y enumerable set
     */
    function length(bytes32 _arrayKeyName) public view returns (uint) {
        bytes memory arrayLengthData = getData(_arrayKeyName);
        if (arrayLengthData.length == 0) {
            return 0;
        }
        uint arrayLength = abi.decode(arrayLengthData, (uint));
        return arrayLength;
    }
}
