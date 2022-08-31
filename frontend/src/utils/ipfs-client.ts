// Crypto
import { ethers } from "ethers";

// IPFS
import { create, IPFSHTTPClient } from "ipfs-http-client";

// Config
import { IPFS_GATEWAY, IPFS_UPLOAD_GATEWAY } from "./../config";

// Helper
import _ from "lodash";

// Types
import type { Image } from "../types/Image";

const KECCAK_256_HASH_FUNCTION = "0x6f357c6a";
// https://2eff.lukso.dev/ipfs
// https://api.2eff.lukso.dev/api/v0/add?stream-channels=true&pin=true&progress=false
export const ipfsClient: IPFSHTTPClient = create({ url: IPFS_UPLOAD_GATEWAY });

// see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-2-ERC725YJSONSchema.md#JSONURL
export const getLSP2JSONURL = (json: Object, ipfsURL: string): string => {
  const hashFunction = ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("keccak256(utf8)")),
    0,
    4
  );
  const hashedJSON = ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(json)))
    .substring(2);

  const hexlifiedIpfsURL = ethers.utils
    .hexlify(ethers.utils.toUtf8Bytes(ipfsURL))
    .substring(2);

  const jsonURL = hashFunction + hashedJSON + hexlifiedIpfsURL;

  return jsonURL;
};

export const uploadJSONToIPFSAndGetLSP2JSONURL = async (json: Object): Promise<null | string> => {
  const cid = await uploadJSONToIPFS(json);
  if(!cid) return null;
  return await getLSP2JSONURL(json, `ipfs://${cid}`);
};

export const uploadJSONToIPFS = async (json: Object): Promise<null | string> => {
  const uploadResult = await ipfsClient.add(JSON.stringify(json));
  if(!uploadResult?.cid) return null;
  return uploadResult.cid.toString();
};

export const decodeLSP2JSONURL = async (
  jsonURL: string
): Promise<null | Object> => {
  const hashFunction = jsonURL.slice(0, 10);
  const hashedJSON = "0x" + jsonURL.slice(10, 74);
  const hexlifiedIpfsURL = "0x" + jsonURL.slice(74);

  if (hashFunction !== KECCAK_256_HASH_FUNCTION) {
    console.error(
      `❌ decodeLSP2JSONURL(${jsonURL}) failed: Unsupported hash function ${hashFunction}`
    );
    return null;
  }

  const ipfsURL = ethers.utils.toUtf8String(
    ethers.utils.arrayify(hexlifiedIpfsURL)
  );

  const response = await fetch(
    IPFS_GATEWAY + "/" + ipfsURL.replace("ipfs://", "")
  );

  if (response.status !== 200) {
    console.error(
      `❌ decodeLSP2JSONURL(${jsonURL}) failed: Invalid IPFS url (${ipfsURL}) - HTTP Status ${response.status}`
    );
    return null;
  }

  const json = await response.json();
  const hash = ethers.utils.hexlify(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(json)))
  );

  if (hash !== hashedJSON) {
    console.error(
      `❌ decodeLSP2JSONURL(${jsonURL}) failed: Different hash (${hash} != ${hashedJSON}) - HTTP Status ${response.status}`
    );
    return null;
  }

  return json;
};

export const getURLWithIPFSGateway = (ipfsURL: string): string =>
  `${IPFS_GATEWAY}/${ipfsURL.replace("ipfs://", "")}`;

export const getImagesWithIPFSGateway = (ipfsImages: Image[]): Image[] =>
  ipfsImages
    .filter((ipfsImage) => _.isString(ipfsImage.url)) // only support non NFT images for now
    .map((ipfsImage) => ({
      ...ipfsImage,
      url: getURLWithIPFSGateway(ipfsImage.url!),
    }));
