// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// >> ERC165 INTERFACE ID
bytes4 constant _INTERFACEID_SOCIAL_NETWORK = 0x52ae1080; // calculated according to https://eips.ethereum.org/EIPS/eip-165
bytes4 constant _INTERFACEID_SOCIAL_NETWORK_PROFILE_DATA = 0x9b0fef4c; // calculated according to https://eips.ethereum.org/EIPS/eip-165
bytes4 constant _INTERFACEID_SOCIAL_NETWORK_POST = 0x8ef076aa; // calculated according to https://eips.ethereum.org/EIPS/eip-165

// >> ERC725Y entries
uint constant _LSP8_TOKEN_ID_TYPE_ADDRESS = 1; // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
bytes32 constant _LSP8_TOKEN_ID_TYPE = 0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4; // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
bytes32 constant _LSP8_TOKEN_ID_METADATA_MINTED_BY = 0xa0093ef0f6788cc87a372bbd12cf83ae7eeb2c85b87e43517ffd5b3978d356c9; // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
bytes32 constant _LSP8_TOKEN_ID_METADATA_TOKEN_ID = 0x51ea539c2c3a29af57cb4b60be9d43689bfa633dba8613743d1be7fb038d36c3; // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md

// ERC725Y LSP8 Metadata Contract - Post Content Key
// {"name":"SNPostContent","key":"0x267100e4b0ea7c1e884866329768f0a9762ecf93ab52ada79174c067d41c4e15","keyType":"Singleton","valueType":"bytes","valueContent":"JSONURL"}
bytes32 constant _LSP8_TOKEN_ID_METADATA_SN_POST_CONTENT = 0x267100e4b0ea7c1e884866329768f0a9762ecf93ab52ada79174c067d41c4e15;

// ERC725Y EnumerableSet keys for Social Network Likes (map points to index in array, array contains universal profile addresses)
bytes32 constant _SN_LIKES_ARRAY_KEY = 0xd74f936d1543a0f1abf8190b00fe9837297a24c4b3d832915264e825bc3fc0c8; // keccak256('SNLikes[]')
bytes12 constant _SN_LIKES_MAP_KEY = 0x1e3d423e52a0cd35309e0000; // bytes10(keccak256('SNLikes')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network Comments (map points to index in array, array contains social network post addresses)
bytes32 constant _SN_COMMENTS_ARRAY_KEY = 0xf2f114f920273bcb634939f1c6afd35a362fe32c9fe59f4a8c08d77fd74280dd; // keccak256('SNComments[]')
bytes12 constant _SN_COMMENTS_MAP_KEY = 0x9178381cc16012dc81a10000; // bytes10(keccak256('SNComments')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network Shares (map points to index in array, array contains social network post addresses)
bytes32 constant _SN_SHARES_ARRAY_KEY = 0x72f27ddc359c9a543c3194ffa294ca7f32bed33c7d644a22949516d73c870ad8; // keccak256('SNShares[]')
bytes12 constant _SN_SHARES_MAP_KEY = 0x5fd6332ee7f2fac51c230000; // bytes10(keccak256('SNShares')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network Subscriptions (map points to index in array, array contains universal profile addresses)
bytes32 constant _SN_SUBSCRIPTIONS_ARRAY_KEY = 0x5a1ba2b446b30525fe4638569ee418eac7ca8fcc0a03f2c4843dd04d27e8c1ac; // keccak256('SNSubscriptions[]')
bytes12 constant _SN_SUBSCRIPTIONS_MAP_KEY = 0xc108b10b147caa96224e0000; // bytes10(keccak256('SNSubscriptions')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network Subscribers (map points to index in array, array contains universal profile addresses)
bytes32 constant _SN_SUBSCRIBERS_ARRAY_KEY = 0x8a82c15a8cea01b6a5d0db3b14e480dfe3197f0aa048e916d77b79abcc7a697c; // keccak256('SNSubscribers[]')
bytes12 constant _SN_SUBSCRIBERS_MAP_KEY = 0x90f039af6118e0ccbbd00000; // bytes10(keccak256('SNSubscribers')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network User Tags (map points to index in array, array contains universal profile addresses)
bytes32 constant _SN_USER_TAGS_ARRAY_KEY = 0xafd89daf17abdaf5797bc0e7d4dbdc56a217d1b6e08b426b40b8f99b9a03fc6c; // keccak256('SNUserTags[]')
bytes12 constant _SN_USER_TAGS_MAP_KEY = 0x6737a26dc0027d9a47570000; // bytes10(keccak256('SNUserTags')) + bytes2(0)

// ERC725Y EnumerableSet keys for Social Network Posts (map points to index in array, array contains social network post addresses)
bytes32 constant _SN_POSTS_ARRAY_KEY = 0xe01ddb6ad4391dac642308cf420c56ac6a269002a7475dafeee62ea09be7a114; // keccak256('SNPosts[]')
bytes12 constant _SN_POSTS_MAP_KEY = 0x7e8492281728d34c260d0000; // bytes10(keccak256('SNPosts')) + bytes2(0)