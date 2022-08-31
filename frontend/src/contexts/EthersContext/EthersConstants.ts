// Config
import { CHAIN_ID } from "../../config";

// Constants
export const REQUESTING_PENDING: number = -32002;
export const USER_REJECTED_REQUEST: number = 4001;

// Chain IDs
export const HARDHAT_LOCAL_CHAIN_ID = 1337;
export const LUKSO_L16_CHAIN_ID = 2828;

// Error Message
export const CHAIN_ID_ERROR_MESSAGE: string = `Network Error: Chain id must be ${parseInt(
    CHAIN_ID
  )}`;
export const ADDRESS_IS_NOT_UNIVERSAL_PROFILE = (universalProfileAddress: string) =>
  `${universalProfileAddress} is not a universal profile`;
