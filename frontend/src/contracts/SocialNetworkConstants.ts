import { ethers } from "ethers";
import { ERC725JSONSchema } from "@erc725/erc725.js";

// >> ERC165 INTERFACE ID
// calculated according to https://eips.ethereum.org/EIPS/eip-165
export const INTERFACE_IDS = {
  SocialNetwork: "0x52ae1080",
  SocialNetworkProfileData: "0x9b0fef4c",
  SocialNetworkPost: "0x8ef076aa",
};

// >> LSP2 ERC725YJSONSchema
export const SocialNetworkPostERC725YJSONSchema: ERC725JSONSchema[] = [
  {
    name: "SNPostContent", // url to post content JSON
    key: "0x267100e4b0ea7c1e884866329768f0a9762ecf93ab52ada79174c067d41c4e15",
    keyType: "Singleton",
    valueType: "bytes",
    valueContent: "JSONURL",
  },
  {
    name: "SNLikes[]", // liked by users
    key: "0xd74f936d1543a0f1abf8190b00fe9837297a24c4b3d832915264e825bc3fc0c8",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNLikes:<address>",
    key: "0x1e3d423e52a0cd35309e0000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNComments[]", // commented by posts
    key: "0xf2f114f920273bcb634939f1c6afd35a362fe32c9fe59f4a8c08d77fd74280dd",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNComments:<address>",
    key: "0x9178381cc16012dc81a10000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNShares[]", // shared by posts
    key: "0x72f27ddc359c9a543c3194ffa294ca7f32bed33c7d644a22949516d73c870ad8",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNShares:<address>",
    key: "0x5fd6332ee7f2fac51c230000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNUserTags[]", // tagged users
    key: "0xafd89daf17abdaf5797bc0e7d4dbdc56a217d1b6e08b426b40b8f99b9a03fc6c",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNUserTags:<address>",
    key: "0x6737a26dc0027d9a47570000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
];

export const SocialNetworkProfileDataERC725YJSONSchema: ERC725JSONSchema[] = [
  {
    name: "SNLikes[]", // liked posts
    key: "0xd74f936d1543a0f1abf8190b00fe9837297a24c4b3d832915264e825bc3fc0c8",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNLikes:<address>",
    key: "0x1e3d423e52a0cd35309e0000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNSubscriptions[]", // subscribed users
    key: "0x5a1ba2b446b30525fe4638569ee418eac7ca8fcc0a03f2c4843dd04d27e8c1ac",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNSubscriptions:<address>",
    key: "0xc108b10b147caa96224e0000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNSubscribers[]", // subscribed by users
    key: "0x8a82c15a8cea01b6a5d0db3b14e480dfe3197f0aa048e916d77b79abcc7a697c",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNSubscribers:<address>",
    key: "0x90f039af6118e0ccbbd00000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNUserTags[]", // tagged in posts
    key: "0xafd89daf17abdaf5797bc0e7d4dbdc56a217d1b6e08b426b40b8f99b9a03fc6c",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNUserTags:<address>",
    key: "0x6737a26dc0027d9a47570000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
  {
    name: "SNPosts[]", // created posts
    key: "0xe01ddb6ad4391dac642308cf420c56ac6a269002a7475dafeee62ea09be7a114",
    keyType: "Array",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "SNPosts:<address>",
    key: "0x7e8492281728d34c260d0000<address>",
    keyType: "Mapping",
    valueType: "bytes32",
    valueContent: "Number",
  },
];

export const SocialNetworkPostType = {
  STANDALONE: 0,
  COMMENT: 1,
  SHARE: 2,
};

// !!! Only supports address mappings since it is for a specific use case !!!
const arrayNameRegex = /^(.+)\[(\d*)\]$/;
const mappingNameRegex = /^([^:]+):([^:]{42})$/;
export const getKeysForNamesFromSchema = (
  schema: ERC725JSONSchema[],
  names: string[]
): string[] => {
  const schemaMap: { [key: string]: ERC725JSONSchema } = schema.reduce(
    (map, element) => {
      let name: string = element.name;
      const lastIndexOfColon: number = name.lastIndexOf(":"); // address mappings
      if (lastIndexOfColon >= 0) {
        name = name.substring(0, lastIndexOfColon + 1);
      }
      return {
        ...map,
        [name]: element,
      };
    },
    {}
  );
  let keys: string[] = [];

  for (const name of names) {
    const arrayMatch = name.match(arrayNameRegex);
    const mappingMatch = name.match(mappingNameRegex);
    if (arrayMatch !== null) {
      const [, arrayNameWithoutBraces, arrayIndex]: string[] =
        Array.from(arrayMatch);

      const schemaElement: undefined | ERC725JSONSchema =
        schemaMap[arrayNameWithoutBraces + "[]"];
      if (!schemaElement) continue;

      const arrayIndexAsNumber = parseInt(arrayIndex);
      if (isNaN(arrayIndexAsNumber)) {
         // no index passed => length requested (unfortunately not supported by standard ERC725 implementation)
        keys.push(schemaElement.key);
      } else {
        keys.push(
          schemaElement.key.substring(0, 34) +
            ethers.utils
              .hexZeroPad(ethers.utils.hexValue(arrayIndexAsNumber), 16)
              .substring(2)
        );
      }
    } else if (mappingMatch) {
      const [, mapKeyName, mapValueName]: string[] = Array.from(mappingMatch);

      const schemaElement: undefined | ERC725JSONSchema =
        schemaMap[mapKeyName + ":"];
      if (!schemaElement) continue;

      const first12Bytes = schemaElement.key.replace(/^(.+)(<.+>)$/, "$1");
      keys.push(first12Bytes + mapValueName.substring(2));
    } else {
      const schemaElement: undefined | ERC725JSONSchema = schemaMap[name];
      if (schemaElement) keys.push(schemaElement.key);
    }
  }

  return keys;
};
