// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// Helper
const { deployERC725YEnumerableSetUtilWithLinkedLibraries } = require("../util/deploy");

describe("ERC725YEnumerableSetUtil", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const deployedERC725YEnumerableSetUtil = await deployERC725YEnumerableSetUtilWithLinkedLibraries(accounts[0].address);

        const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
        const mapKeyNamePrefix = enumerableSet.Map;
        const arrayKeyName = enumerableSet.Array;

        return {
            accounts,
            deployedERC725YEnumerableSetUtil,
            mapKeyNamePrefix,
            arrayKeyName
        };
    };

    describe("function addElementToEnumerableSet(bytes12 _mapKeyNamePrefix, bytes32 _arrayKeyName, address _address) public returns (bool)", () => {
        it("Should add address to enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        });

        it("Should add two addresses to enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
        });

        it("Should not add duplicate address to enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        });
    });

    describe("function removeElementFromEnumerableSet(bytes12 _mapKeyNamePrefix, bytes32 _arrayKeyName, address _address) public returns (bool)", () => {
        it("Should not revert on removing non-existing address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(false);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(0);

            await expect(deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address)).not.to.reverted;
        });

        it("Should remove existing address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(false);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(0);
        });

        it("Should remove 2 existing address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(true);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
            
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(false);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(0);

            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(false);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(0);
        });

        it("Should assign index of first address to last address after removing the first address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[2].address);
            const indexOfFirstAddress = await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[2].address)).to.equal(3);

            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[2].address)).to.equal(indexOfFirstAddress);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
        });

        it("Should assign index of second address to last address after removing the second address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[2].address);
            const indexOfFirstAddress = await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[2].address)).to.equal(3);

            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[2].address)).to.equal(indexOfFirstAddress);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        });

        it("Should keep indices the same after removing the last address from enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[2].address);
            const indexOfFirstAddress = await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address);
            const indexOfSecondAddress = await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);

            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[2].address);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(indexOfFirstAddress);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(indexOfSecondAddress);
        });
    });

    describe("function isAddressInEnumerableSet(bytes12 _mapKeyNamePrefix, address _address) public view returns (bool)", () => {
        it("Should return false if the enumerable set is empty", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix } = await loadFixture(deployFixture);

            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(false);
        });

        it("Should return true after adding an address", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
        });

        it("Should return true after adding the same address twice", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
        });

        it("Should return true after adding more than one address", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
        });

        it("Should return false after adding and immediately removing the same address", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(false);
        });

        it("Should return true after adding an address and removing a non-existent one", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.isAddressInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(true);
        });
    });

    describe("function getAddressIndexInEnumerableSet(bytes12 _mapKeyNamePrefix, address _address) public view returns (uint)", () => {
        it("Should return 0 as index for given address if the enumerable set is empty", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix } = await loadFixture(deployFixture);

            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(0);
        });

        it("Should return 0 as index for given address if it is not in the enumerable set", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(0);
        });

        it("Should return 1 as index for given address after adding it", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        });

        it("Should return 1 as index for given address after adding it twice", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
        });

        it("Should return 0 as index for given address after adding and removing it", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(0);
        });

        it("Should return 1 and 2 as indices for two different addresses after adding them", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
        });

        it("Should return 1 as index for the second address after adding two different addresses and then removing the first one", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[0].address)).to.equal(1);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(2);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.getAddressIndexInEnumerableSet(mapKeyNamePrefix, accounts[1].address)).to.equal(1);
        });
    });

    describe("function length(bytes32 _arrayKeyName) public view returns (uint)", () => {
        it("Should return 0 as length if the enumerable set is empty", async () => {
            const { deployedERC725YEnumerableSetUtil, arrayKeyName } = await loadFixture(deployFixture);

            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
        });

        it("Should return 1 as length after adding an address", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
        });

        it("Should return 0 as length after adding and removing the same address", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
        });

        it("Should return 2 as length after adding two different addresses", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
        });

        it("Should return 1 as length after adding the same address twice", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
        });

        it("Should return 1 as length after adding two addresses and then removing one of them", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
        });
        it("Should return 1 as length after adding two addresses and then removing one of them twice", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
        });

        it("Should return 0 as length after adding two addresses and then removing both of them", async () => {
            const { accounts, deployedERC725YEnumerableSetUtil, mapKeyNamePrefix, arrayKeyName } = await loadFixture(deployFixture);

            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            await deployedERC725YEnumerableSetUtil.addElementToEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(2);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[0].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(1);
            await deployedERC725YEnumerableSetUtil.removeElementFromEnumerableSet(mapKeyNamePrefix, arrayKeyName.length, accounts[1].address);
            expect(await deployedERC725YEnumerableSetUtil.length(arrayKeyName.length)).to.equal(0);
        });
    });
});