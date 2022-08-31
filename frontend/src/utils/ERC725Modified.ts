// @ts-nocheck
// Crypto
import { ethers } from "ethers";
import ERC725 from "@erc725/erc725.js";
import { ERC725JsonRpcProvider } from "./ERC725JsonRpcProvider";
import { IPFS_GATEWAY, RPC_URL } from "./../config";

export class ERC725Modified extends ERC725 {
  constructor(originalERC725Contract: ERC725) {
    super(
      originalERC725Contract.options.schemas,
      originalERC725Contract.options.address,
      new ERC725JsonRpcProvider(RPC_URL),
      {
        ipfsGateway: IPFS_GATEWAY,
      }
    );
  }

  // As 0 is a sentinel value in the custom ERC725YEnumerableSet we have to increase the array length by one and remove invalid values (= '0x')
  async getArrayValues(schema, data) {
    if (data[schema.key].value !== "0x") {
      const amount = parseInt(data[schema.key].value);
      if (!isNaN(amount)) {
        data[schema.key].value = ethers.utils.hexZeroPad(
          ethers.utils.hexValue(amount + 1),
          32
        );
      }
    }
    const values = await super.getArrayValues(schema, data);
    return values.filter((value) => value.value !== "0x");
  }
}
