// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// Helper
const { deployLSP2KeyUtil } = require("../util/deploy");

describe("LSP2KeyUtil", () => {
    const deployFixture = async () => {
        const [owner] = await ethers.getSigners();
        const deployedLSP2KeyUtil = await deployLSP2KeyUtil();

        return {
            owner,
            deployedLSP2KeyUtil
        };
    };

    describe("function getMappedAddressKeyName(bytes12 _mapKeyNamePrefix, address _address) external pure returns (bytes32)", () => {
        it("Should calculate correct mapped address key name", async () => {
            const { owner, deployedLSP2KeyUtil } = await loadFixture(deployFixture);

            const _mapKeyNamePrefix = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes.Map;
            const _address = owner.address;
            const expectedValue = (_mapKeyNamePrefix + _address.substring(2));
            expect(await deployedLSP2KeyUtil.getMappedAddressKeyName(_mapKeyNamePrefix, _address)).to.hexEqual(expectedValue);
        });

    });
});