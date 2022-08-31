if (!process.env.CONTROLLING_ADDRESS_PK) {
    console.log("Mandatory env var not set: CONTROLLING_ADDRESS_PK");
    process.exit(1);
}

if (!process.env.SOCIAL_NETWORK_CONTRACT_ADDRESS) {
    console.log("Mandatory env var not set: SOCIAL_NETWORK_CONTRACT_ADDRESS");
    process.exit(1);
}

if (!process.env.RPC_URL) {
    console.log("Mandatory env var not set: RPC_URL");
    process.exit(1);
}