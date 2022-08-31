module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    //const LSP2KeyUtilAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const SocialNetworkPostFactoryAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
    const SocialNetworkProfileDataFactoryAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
    //const SocialNetworkAddress = "0xEf8A3D7850A20b2c06Dd790c03AC3445C9F8f6Af";

    const lsp4Metadata = "0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553";
    const deployedLib = await deploy("SocialNetwork", {
        from: deployer,
        args: [lsp4Metadata],
        gasPrice: 10000000000, // 10 GWEI
        libraries: {
            SocialNetworkPostFactory: SocialNetworkPostFactoryAddress,
            SocialNetworkProfileDataFactory: SocialNetworkProfileDataFactoryAddress
        },
        log: true,
    });

    console.log(deployedLib.address);
};
module.exports.tags = ["SocialNetwork"];
