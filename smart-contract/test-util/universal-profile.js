// Hardhat
const { ethers, lspFactory } = require("hardhat");

// Constants
const { OPERATION_TYPE } = require("@erc725/smart-contracts/constants");

// ABI
const LSP0ERC725AccountABI = require("@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json").abi;
const LSP6KeyManagerABI = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json").abi;
const ISocialNetworkABI = require("../artifacts/contracts/ISocialNetwork.sol/ISocialNetwork.json").abi;
const SocialNetworkPostABI = require("../artifacts/contracts/SocialNetworkPost.sol/SocialNetworkPost.json").abi;
const SocialNetworkProfileDataABI = require("../artifacts/contracts/SocialNetworkProfileData.sol/SocialNetworkProfileData.json").abi;

const createUniversalProfile = async (universalProfileOwner, socialNetwork) => {
    const universalProfile = await lspFactory.UniversalProfile.deploy({ controllerAddresses: [universalProfileOwner.address] });
    const universalProfileAddress = universalProfile.LSP0ERC725Account.address;

    const ISocialNetworkInterface = new ethers.utils.Interface(ISocialNetworkABI);
    const LSP0ERC725AccountABIInterface = new ethers.utils.Interface(LSP0ERC725AccountABI);

    const LSP6KeyManager = new ethers.Contract(universalProfile.LSP6KeyManager.address, LSP6KeyManagerABI, universalProfileOwner);
    const executeCallThroughKeyManager = async (functionName, ...params) => {
        const encodedSocialNetworkCall = ISocialNetworkInterface.encodeFunctionData(functionName, params);
        const encodedExecuteCall = LSP0ERC725AccountABIInterface.encodeFunctionData("execute", [OPERATION_TYPE.CALL, socialNetwork.address, 0, encodedSocialNetworkCall]);
        const tx = await LSP6KeyManager.execute(encodedExecuteCall);
        await tx.wait();
        return tx;
    };

    const register = async () => {
        await executeCallThroughKeyManager("register");

        const eventFilter = socialNetwork.filters.UserRegistered();
        const events = await socialNetwork.queryFilter(eventFilter);

        const SocialNetworkProfileDataInterface = new ethers.utils.Interface(SocialNetworkProfileDataABI);
        return new ethers.Contract(events[events.length-1].args.socialProfileData, SocialNetworkProfileDataInterface, universalProfileOwner);
    };

    const createStandalonePost = async (postContentData, taggedUsers = []) => {
        await executeCallThroughKeyManager("createPost", postContentData, taggedUsers);

        const eventFilter = socialNetwork.filters.UserCreatedPost();
        const events = await socialNetwork.queryFilter(eventFilter);

        const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
        return new ethers.Contract(events[events.length-1].args.newPost, SocialNetworkPostInterface, universalProfileOwner);
    };

    const createCommentPost = async (postContentData, referencedPostAddress, taggedUsers = []) => {
        await executeCallThroughKeyManager("createCommentPost", postContentData, taggedUsers, referencedPostAddress); 
        
        const eventFilter = socialNetwork.filters.UserCreatedPost();
        const events = await socialNetwork.queryFilter(eventFilter);

        const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
        return new ethers.Contract(events[events.length-1].args.newPost, SocialNetworkPostInterface, universalProfileOwner);
    };

    const createSharePost = async (postContentData, referencedPostAddress, taggedUsers = []) => {
        await executeCallThroughKeyManager("createSharePost", postContentData, taggedUsers, referencedPostAddress);
        
        const eventFilter = socialNetwork.filters.UserCreatedPost();
        const events = await socialNetwork.queryFilter(eventFilter);

        const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
        return new ethers.Contract(events[events.length-1].args.newPost, SocialNetworkPostInterface, universalProfileOwner);
    };

    return {
        universalProfileOwner, // EOA (= Owner -> KeyManager -> Universal Profile)
        universalProfile, // Universal Profile contract instance
        universalProfileAddress, // Universal Profile address
        executeCallThroughKeyManager, // Universal Profile helper function for calling methods through the KeyManager
        register,
        createStandalonePost, // Creates a post of type STANDALONE with this universal profile
        createCommentPost, // Creates a post of type COMMENT with this universal profile
        createSharePost // Creates a post of type SHARE with this universal profile
    };
};

// Local constant
const MAX_ACCOUNTS = 10;
const getOwnerAndUniversalProfiles = async (socialNetwork) => {
    const signers = await ethers.getSigners();
    const owner = signers[0];

    const accounts = [];
    for (let i = 1; i < MAX_ACCOUNTS && i < signers.length; i++) {
        accounts.push(await createUniversalProfile(signers[i], socialNetwork));
    }

    return { owner, accounts };
};

module.exports = {
    createUniversalProfile,
    getOwnerAndUniversalProfiles
};