// Crypto
import { ethers } from "ethers";

// Artifacts
import LSP0ERC725AccountArtifact from "@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json" assert {type: "json"};
import UniversalProfileArtifact from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json" assert {type: "json"};
import KeyManagerArtifact from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json" assert {type: "json"};
import SocialNetworkArtifact from "./contracts/SocialNetwork.json" assert {type: "json"};

export const wallet = new ethers.Wallet(
    process.env.CONTROLLING_ADDRESS_PK,
    new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
);

export const executeFunctionThroughKeyManager = async (
    universalProfileAddress,
    functionName,
    ...params
) => {
    const IKeyManager = new ethers.utils.Interface(KeyManagerArtifact.abi);
    const ISocialNetwork = new ethers.utils.Interface(SocialNetworkArtifact.abi);
    const IUniversalProfile = new ethers.utils.Interface(
        UniversalProfileArtifact.abi
    );
    const ILSP0ERC725Account = new ethers.utils.Interface(
        LSP0ERC725AccountArtifact.abi
    );

    const profile = new ethers.Contract(
        universalProfileAddress,
        IUniversalProfile,
        wallet
    );

    const keyManagerAddress = await profile.getOwner();
    const keyManager = new ethers.Contract(
        keyManagerAddress,
        IKeyManager,
        wallet
    );

    const encodedSocialNetworkCall = ISocialNetwork.encodeFunctionData(
        functionName,
        params
    );
    const encodedExecuteCall = ILSP0ERC725Account.encodeFunctionData("execute", [
        0, // CALL
        process.env.SOCIAL_NETWORK_CONTRACT_ADDRESS,
        0,
        encodedSocialNetworkCall,
    ]);
    const tx = await keyManager.execute(encodedExecuteCall);
    await tx.wait();
    return tx;
};
