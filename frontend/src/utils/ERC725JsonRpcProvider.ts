import { ethers } from "ethers";

export class ERC725JsonRpcProvider extends ethers.providers.JsonRpcProvider {
  request({method, params}: {method: string, params: Array<any>}): Promise<any> {
    return super.send(method, params);
  }
}
