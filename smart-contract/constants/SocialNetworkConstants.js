// >> ERC165 INTERFACE ID

// calculated according to https://eips.ethereum.org/EIPS/eip-165
const INTERFACE_IDS = {
    SocialNetwork: "0x52ae1080",
    SocialNetworkProfileData: "0x9b0fef4c",
    SocialNetworkPost: "0x8ef076aa"
};

// >> ERC725Y
const LSP8TokenIdTypeAddress = 1;
const ERC725YKeys = {
    LSP8: { // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
        TokenId: {
            Type: "0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4",
            Metadata: {
                MintedBy: "0xa0093ef0f6788cc87a372bbd12cf83ae7eeb2c85b87e43517ffd5b3978d356c9",
                TokenId: "0x51ea539c2c3a29af57cb4b60be9d43689bfa633dba8613743d1be7fb038d36c3"
            }
        }
    },
    LSP8Custom: { // {"name":"SNPostContent","key":"0x267100e4b0ea7c1e884866329768f0a9762ecf93ab52ada79174c067d41c4e15","keyType":"Singleton","valueType":"bytes","valueContent":"JSONURL"}
        TokenId: {
            Metadata: {
                SNPostContent: "0x267100e4b0ea7c1e884866329768f0a9762ecf93ab52ada79174c067d41c4e15"
            }
        }
    },
    EnumerableSet: { // Custom ERC725Y EnumerableSet
        SNLikes: {
            Array: {
                length: "0xd74f936d1543a0f1abf8190b00fe9837297a24c4b3d832915264e825bc3fc0c8",
                index: "0xd74f936d1543a0f1abf8190b00fe9837"
            }, // keccak256('SNLikes[]')
            Map: "0x1e3d423e52a0cd35309e0000" // bytes10(keccak256('SNLikes')) + bytes2(0)
        },
        SNComments: {
            Array: {
                length: "0xf2f114f920273bcb634939f1c6afd35a362fe32c9fe59f4a8c08d77fd74280dd",
                index: "0xf2f114f920273bcb634939f1c6afd35a"
            }, // keccak256('SNComments[]')
            Map: "0x9178381cc16012dc81a10000" // bytes10(keccak256('SNComments')) + bytes2(0)
        },
        SNShares: {
            Array: {
                length: "0x72f27ddc359c9a543c3194ffa294ca7f32bed33c7d644a22949516d73c870ad8",
                index: "0x72f27ddc359c9a543c3194ffa294ca7f"
            }, // keccak256('SNShares[]')
            Map: "0x5fd6332ee7f2fac51c230000" // bytes10(keccak256('SNShares')) + bytes2(0)
        },
        SNSubscriptions: {
            Array: {
                length: "0x5a1ba2b446b30525fe4638569ee418eac7ca8fcc0a03f2c4843dd04d27e8c1ac",
                index: "0x5a1ba2b446b30525fe4638569ee418ea"
            }, // keccak256('SNSubscriptions[]')
            Map: "0xc108b10b147caa96224e0000" // bytes10(keccak256('SNSubscriptions')) + bytes2(0)
        },
        SNSubscribers: {
            Array: {
                length: "0x8a82c15a8cea01b6a5d0db3b14e480dfe3197f0aa048e916d77b79abcc7a697c",
                index: "0x8a82c15a8cea01b6a5d0db3b14e480df"
            }, // keccak256('SNSubscribers[]')
            Map: "0x90f039af6118e0ccbbd00000" // bytes10(keccak256('SNSubscribers')) + bytes2(0)
        },
        SNUserTags: {
            Array: {
                length: "0xafd89daf17abdaf5797bc0e7d4dbdc56a217d1b6e08b426b40b8f99b9a03fc6c",
                index: "0xafd89daf17abdaf5797bc0e7d4dbdc56"
            }, // keccak256('SNUserTags[]')
            Map: "0x6737a26dc0027d9a47570000" // bytes10(keccak256('SNUserTags')) + bytes2(0)
        },
        SNPosts: {
            Array: {
                length: "0xe01ddb6ad4391dac642308cf420c56ac6a269002a7475dafeee62ea09be7a114",
                index: "0xe01ddb6ad4391dac642308cf420c56ac"
            }, // keccak256('SNPosts[]')
            Map: "0x7e8492281728d34c260d0000" // bytes10(keccak256('SNPosts')) + bytes2(0)
        }
    }
};


const ERC725YValues = {
    LSP4: {
        TokenName: "Social Network Post",
        TokenSymbol: "SNP"
    }
};

const Errors = {
    Modifier: {
        OnlyOwner: "Ownable: caller is not the owner",
    },
    SocialNetwork: {
        UserAddressAlreadyRegistered: "User address is already registered",
        UserAddressNotRegistered: "User address is not registered",
        UserAddressIsAnEOA: "User address is an EOA - Only smart contract based accounts are supported",
        UserAddressIsNotAUniversalProfile: "User address is not an universal profile (ERC725X and/or ERC725Y interfaces not available)",
        PostAddressNotOwnedBySocialNetwork: "Post address is not owned by current SocialNetwork contract instance",
        PostAddressNotValid: "Post address is not pointing to a valid post (SocialNetworkPost interface not available)",
        UserNotLikedPost: "User did not like the post yet",
        UserLikedPost: "User has already liked the post",
        UserNotSubscriber: "User is not a subscriber yet",
        UserIsSubscriber: "User is already a subscriber",
        UserNotAuthor: "User must be the post author",
        UserIsAuthor: "User must not be the post author",
    },
    SocialNetworkPost: {
        constructor: {
            UnsupportedInterface: "Target post address must support the SOCIAL_NETWORK_POST interface (ERC165)",
            MoreThan3UsersTagged: "Amount of tagged users is greater than 3",
            SameUsersTagged: "Tagged users must be different"
        }
    }
};

const SocialNetworkPostType = {
    STANDALONE: 0,
    COMMENT: 1,
    SHARE: 2
};

module.exports = {
    INTERFACE_IDS,
    LSP8TokenIdTypeAddress,
    ERC725YKeys,
    ERC725YValues,
    Errors,
    SocialNetworkPostType
};