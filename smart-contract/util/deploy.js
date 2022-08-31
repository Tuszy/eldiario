const { ethers } = require("hardhat");

const deployLSP2KeyUtil = async () => {
    const LSP2KeyUtil = await ethers.getContractFactory("LSP2KeyUtil");
    console.log("Start deploying LSP2KeyUtil");
    const deployedLSP2KeyUtil = await LSP2KeyUtil.deploy();
    await deployedLSP2KeyUtil.deployed();
    console.log("Successfully deployed LSP2KeyUtil: ", deployedLSP2KeyUtil.address);
    return deployedLSP2KeyUtil;
};

const deployERC725YEnumerableSetUtilWithLinkedLibraries = async (ownerAddress) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const ERC725YEnumerableSetUtil = await ethers.getContractFactory("ERC725YEnumerableSetUtil", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address
        }
    });
    return await ERC725YEnumerableSetUtil.deploy(ownerAddress);
};

const deploySocialNetworkPostFactory = async (deployedLSP2KeyUtil) => {
    const SocialNetworkPostFactory = await ethers.getContractFactory("SocialNetworkPostFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    console.log("Start deploying SocialNetworkPostFactory");
    const deployedSocialNetworkPostFactory = await SocialNetworkPostFactory.deploy();
    await deployedSocialNetworkPostFactory.deployed();
    console.log("Successfully deployed SocialNetworkPostFactory: ", deployedSocialNetworkPostFactory.address);
    return deployedSocialNetworkPostFactory;
};

const deploySocialNetworkPostFactoryTestWithLinkedLibraries = async () => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const deployedSocialNetworkPostFactory = await deploySocialNetworkPostFactory(deployedLSP2KeyUtil);
    const SocialNetworkPostFactoryTest = await ethers.getContractFactory("SocialNetworkPostFactoryTest", {
        libraries: {
            SocialNetworkPostFactory: deployedSocialNetworkPostFactory.address,
        }
    });
    return await SocialNetworkPostFactoryTest.deploy();
};

const deploySocialNetworkPostWithLinkedLibraries = async (owner, author, postType, taggedUsers, data, referencedPost) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const SocialNetworkPost = await ethers.getContractFactory("SocialNetworkPost", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    return await SocialNetworkPost.deploy(owner, author, postType, taggedUsers, data, referencedPost);
};

const deploySocialNetworkProfileDataFactory = async (deployedLSP2KeyUtil) => {
    const SocialNetworkProfileDataFactory = await ethers.getContractFactory("SocialNetworkProfileDataFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });

    console.log("Start deploying SocialNetworkProfileDataFactory");
    const deployedSocialNetworkProfileDataFactory = await SocialNetworkProfileDataFactory.deploy();
    await deployedSocialNetworkProfileDataFactory.deployed();
    console.log("Successfully deployed SocialNetworkProfileDataFactory: ", deployedSocialNetworkProfileDataFactory.address);
    return deployedSocialNetworkProfileDataFactory;
};

const deploySocialNetworkProfileDataFactoryTestWithLinkedLibraries = async () => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const deployedSocialNetworkProfileDataFactory = await deploySocialNetworkProfileDataFactory(deployedLSP2KeyUtil);
    const SocialNetworkProfileDataFactoryTest = await ethers.getContractFactory("SocialNetworkProfileDataFactoryTest", {
        libraries: {
            SocialNetworkProfileDataFactory: deployedSocialNetworkProfileDataFactory.address,
        }
    });
    return await SocialNetworkProfileDataFactoryTest.deploy();
};

const deploySocialNetworkProfileDataWithLinkedLibraries = async (owner, user) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const SocialNetworkProfileData = await ethers.getContractFactory("SocialNetworkProfileData", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    return await SocialNetworkProfileData.deploy(owner, user);
};

const deploySocialNetwork = async (constructorParam, deployedSocialNetworkPostFactory, deployedSocialNetworkProfileDataFactory) => {
    const SocialNetwork = await ethers.getContractFactory("SocialNetwork", {
        libraries: {
            SocialNetworkPostFactory: deployedSocialNetworkPostFactory.address,
            SocialNetworkProfileDataFactory: deployedSocialNetworkProfileDataFactory.address
        }
    });

    console.log("Start deploying SocialNetwork");
    const deployedSocialNetwork = await SocialNetwork.deploy(constructorParam);
    await deployedSocialNetwork.deployed();
    console.log("Successfully deployed SocialNetwork: ", deployedSocialNetwork.address);
    return deployedSocialNetwork;
};

const deploySocialNetworkWithLinkedLibraries = async (constructorParam) => {
    const lsp2KeyUtil = await deployLSP2KeyUtil();
    const socialNetworkPostFactory = await deploySocialNetworkPostFactory(lsp2KeyUtil);
    const socialNetworkProfileDataFactory = await deploySocialNetworkProfileDataFactory(lsp2KeyUtil);
    const socialNetwork = await deploySocialNetwork(constructorParam, socialNetworkPostFactory, socialNetworkProfileDataFactory);

    return {
        socialNetwork,
        libraries: {
            lsp2KeyUtil,
            socialNetworkPostFactory,
            socialNetworkProfileDataFactory,
        }
    };
};

module.exports = {
    deployLSP2KeyUtil,
    deployERC725YEnumerableSetUtilWithLinkedLibraries,
    deploySocialNetworkPostFactory,
    deploySocialNetworkPostFactoryTestWithLinkedLibraries,
    deploySocialNetworkPostWithLinkedLibraries,
    deploySocialNetworkProfileDataFactory,
    deploySocialNetworkProfileDataFactoryTestWithLinkedLibraries,
    deploySocialNetworkProfileDataWithLinkedLibraries,
    deploySocialNetwork,
    deploySocialNetworkWithLinkedLibraries
};