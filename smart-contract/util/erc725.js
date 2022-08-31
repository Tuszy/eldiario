// Hardhat
const { ethers } = require("hardhat");

// ABI
const ERC725 = require("@erc725/smart-contracts/artifacts/ERC725.json");

const createERC725ContractInstance = async (signer) => {
    const ERC725Interface = new ethers.utils.Interface(ERC725.abi);
    const ERC725ContractFactory = new ethers.ContractFactory(ERC725Interface, ERC725.bytecode, signer);
    return await ERC725ContractFactory.deploy(signer.address);
};

module.exports = {
    createERC725ContractInstance
};