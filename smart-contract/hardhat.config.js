require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");

// Add Web3Provider to HRE
// eslint-disable-next-line no-undef
extendEnvironment(async (hre) => {
    hre.Web3Provider = new hre.ethers.providers.Web3Provider(
        hre.network.provider
    );
});

// Add LSPFactory to HRE
// eslint-disable-next-line no-undef
extendEnvironment(async (hre) => {
    const { LSPFactory } = require("@lukso/lsp-factory.js");
    hre.LSPFactory = LSPFactory;

    // hre.network.provider is an EIP1193-compatible provider.
    hre.lspFactory = new LSPFactory(hre.Web3Provider, {
        deployKey: hre.network.config.accounts, // Private key of the account which will deploy smart contracts
        chainId: hre.network.config.chainId,
    });
});

// Add ERC725 to HRE
// eslint-disable-next-line no-undef
extendEnvironment(async (hre) => {
    const { ERC725 } = require("@erc725/erc725.js");
    hre.ERC725 = ERC725;
});

const DEFAULT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
    },
    networks: {
        lukso: {
            url: "https://rpc.l16.lukso.network",
            chainId: 2828,
            accounts: [process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY],
        },
        hardhat: {
            chainId: 1337,
            // accounts: [{
            //     privateKey: process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY,
            //     balance: "10000000000000000000000" // 10000 ETH
            // }]
        },
        localhost: {
            chainId: 1337,
            accounts: [
                "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
                "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
                "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
                "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
                "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
            ],
        },
    },
    etherscan: {
        apiKey: {
            //lukso: "lukso api key for lukso-scan"
        },
    },
    namedAccounts: {
        deployer: 0
    },
};
