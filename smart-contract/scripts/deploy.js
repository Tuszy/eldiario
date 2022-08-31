// Hardhat
const { ethers, lspFactory } = require("hardhat");
const { deploySocialNetworkWithLinkedLibraries } = require("../util/deploy");

const MAX_ACCOUNTS = 2;

async function main() {
    const accounts = await ethers.getSigners();

    const constructorParam = ethers.utils.arrayify("0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553");
    const { socialNetwork } = await deploySocialNetworkWithLinkedLibraries(constructorParam);
    await socialNetwork.deployed();

    for(let i=0;i<MAX_ACCOUNTS;i++){
        const universalProfile = await lspFactory.UniversalProfile.deploy({ controllerAddresses: [accounts[i].address] });
        console.log(`Account ${accounts[i].address} - UniversalProfile ${universalProfile.LSP0ERC725Account.address}`);
    }

    console.log("SocialNetwork deployed to:", socialNetwork.address);
}

main().catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-undef
    process.exitCode = 1;
});
