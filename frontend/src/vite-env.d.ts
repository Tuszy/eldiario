/// <reference types="vite/client" />

// Crypto
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}
