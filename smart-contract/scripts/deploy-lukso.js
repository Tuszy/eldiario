// Hardhat
const { ethers } = require("hardhat");
const { deploySocialNetworkWithLinkedLibraries } = require("../util/deploy");

/**
 * 
Start deploying LSP2KeyUtil
Successfully deployed LSP2KeyUtil:  0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
Start deploying SocialNetworkPostFactory
Successfully deployed SocialNetworkPostFactory:  0x59b670e9fA9D0A427751Af201D676719a970857b
Start deploying SocialNetworkProfileDataFactory
Successfully deployed SocialNetworkProfileDataFactory:  0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1
Start deploying SocialNetwork
Successfully deployed SocialNetwork:  0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44
SocialNetwork deployed to: 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44
 * 
 */

async function main() {
    /*
 const data = {
      "LSP4Metadata": {
          "description": "Decentralized Social Media Feed",
          "links": [
              {
                  "title": "Website",
                  "url": "el-diar.io"
              }
          ],
          "icon": [],
          "images": [],
          "assets": []  
      }
  };
  const ipfsURL =  "ipfs://QmecrnfEFLMdW6BXjJe1nvyLdPeP3CYgQbXwNmY8P7LfeS";
*/

    const constructorParam = ethers.utils.arrayify(
        "0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553"
    );
    const { socialNetwork } = await deploySocialNetworkWithLinkedLibraries(
        constructorParam
    );
    await socialNetwork.deployed();

    console.log("SocialNetwork deployed to:", socialNetwork.address);
}

main().catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-undef
    process.exitCode = 1;
});
