// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const SocialNetworkProfileDataABI = require("../artifacts/contracts/SocialNetworkProfileData.sol/SocialNetworkProfileData.json").abi;

// Helper
const { deploySocialNetworkProfileDataFactoryTestWithLinkedLibraries } = require("../util/deploy");

describe("SocialNetworkProfileDataFactoryTest", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const deployedSocialNetworkProfileDataFactoryTest = await deploySocialNetworkProfileDataFactoryTestWithLinkedLibraries(accounts[0].address);

        const createValidProfileData = async (owner) => {
            const tx = await deployedSocialNetworkProfileDataFactoryTest.createProfileData(owner.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedProfileData");
            const SocialNetworkProfileDataInterface = new ethers.utils.Interface(SocialNetworkProfileDataABI);
            return new ethers.Contract(event.args.newProfileData, SocialNetworkProfileDataInterface, owner);
        };

        return {
            accounts,
            deployedSocialNetworkProfileDataFactoryTest,
            createValidProfileData
        };
    };

    describe("function createProfileData(address _user) public returns (address)", () => {
        it("Should create instance of SocialNetworkProfileData contract and emit CreatedProfileData event", async () => {
            const { accounts, deployedSocialNetworkProfileDataFactoryTest } = await loadFixture(deployFixture);

            await expect(deployedSocialNetworkProfileDataFactoryTest.createProfileData(accounts[0].address))
                .to.emit(deployedSocialNetworkProfileDataFactoryTest, "CreatedProfileData")
                .withArgs(accounts[0].address, anyValue);
        });

        it(`Should create valid instance of SocialNetworkProfileData which supports the interface id ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkProfileData}`, async () => {
            const { accounts, deployedSocialNetworkProfileDataFactoryTest } = await loadFixture(deployFixture);
            const tx = await deployedSocialNetworkProfileDataFactoryTest.createProfileData(accounts[0].address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedProfileData");
            expect(event).not.to.be.null;
            expect(event.args.user).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newProfileData, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkProfileData)).to.be.equal(true);
        });

        it("Should assign param _user to storage variable user", async () => {
            const { accounts, createValidProfileData } = await loadFixture(deployFixture);

            const profileData = await createValidProfileData(accounts[0]);

            expect(await profileData.user()).to.eql(accounts[0].address);
        });

        it("Should set SocialNetworkProfileDataFactory contract instance's address as owner of profile data (owner != user)", async () => {
            const { accounts, deployedSocialNetworkProfileDataFactoryTest, createValidProfileData } = await loadFixture(deployFixture);

            const profileData = await createValidProfileData(accounts[0]);

            expect(await profileData.owner()).to.eql(deployedSocialNetworkProfileDataFactoryTest.address);
        });
    });
});