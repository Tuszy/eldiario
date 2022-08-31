// Config
import "dotenv/config";
import "./require-env-vars.js";

// Server
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Crypto
import { ethers } from "ethers";
import { wallet, executeFunctionThroughKeyManager } from "./crypto-util.js";

// Helper
import _ from "lodash-es";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// half-hearted validation since the blockchain gonna do it for us ;P
app.use((req, res, next) => {
    if (!req.body?.address) {
        res.status(400).json({ message: "address not available" });
        return;
    } else if (!ethers.utils.isAddress(req.body.address)) {
        res.status(400).json({ message: "address must be a valid address" });
        return;
    } else if (!req.body?.functionName) {
        res.status(400).json({ message: "functionName not available" });
        return;
    } else if (!_.isString(req.body?.functionName)) {
        res.status(400).json({ message: "functionName must be a string" });
        return;
    } else if (!req.body.params) {
        res.status(400).json({ message: "params not available" });
        return;
    } else if (!_.isArray(req.body.params)) {
        res.status(400).json({ message: "params must be an array" });
        return;
    }

    next();
});

app.post("/", async (req, res) => {
    const {
        address,
        functionName,
        params,
    } = req.body;

    try {
        const tx = await executeFunctionThroughKeyManager(
            address,
            functionName,
            params
        );
        res.status(200).json(tx);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(process.env.PORT || 80, () => {
    console.log("SERVER STARTED");
    console.log("PORT: ", process.env.PORT || 80);
    console.log("RPC_URL: ", process.env.RPC_URL);
    console.log("SOCIAL NETWORK ADDRESS: ", process.env.SOCIAL_NETWORK_CONTRACT_ADDRESS);
    console.log("CONTROLLING ADDRESS: ", wallet.address);
});
