// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;

// Helper
const { deploySocialNetworkPostWithLinkedLibraries } = require("../util/deploy");

describe("SocialNetworkPost", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const randomPostContentData = ethers.utils.toUtf8Bytes("RANDOM POST CONTENT DATA");

        const createStandalonePost = async (author, taggedUsers, referencedPost = ethers.constants.AddressZero) => {
            return await deploySocialNetworkPostWithLinkedLibraries(accounts[0].address, author, SocialNetworkConstants.SocialNetworkPostType.STANDALONE, taggedUsers, randomPostContentData, referencedPost);
        };

        const createCommentPost = async (author, taggedUsers, referencedPost) => {
            return await deploySocialNetworkPostWithLinkedLibraries(accounts[0].address, author, SocialNetworkConstants.SocialNetworkPostType.COMMENT, taggedUsers, randomPostContentData, referencedPost);
        };

        const createSharePost = async (author, taggedUsers, referencedPost) => {
            return await deploySocialNetworkPostWithLinkedLibraries(accounts[0].address, author, SocialNetworkConstants.SocialNetworkPostType.SHARE, taggedUsers, randomPostContentData, referencedPost);
        };

        return {
            accounts,
            createStandalonePost,
            createCommentPost,
            createSharePost,
            randomPostContentData
        };
    };

    describe("constructor(address _owner, address _author, SocialNetworkPostType _postType, address[] memory _taggedUsers, bytes memory _data, address _referencedPost) ERC725YEnumerableSetUtil(_owner)", () => {
        it(`Should create valid instance of SocialNetworkPost which supports the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost} (STANDALONE)`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);
            const post = await createStandalonePost(accounts[0].address, []);

            const erc165 = new ethers.Contract(post.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it("Should assign 'zero address' to storage variable referencedPost (STANDALONE)", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);
            expect(await post.referencedPost()).to.eql(ethers.constants.AddressZero);
        });

        it(`Should create valid instance of SocialNetworkPost which supports the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost} (COMMENT)`, async () => {
            const { accounts, createStandalonePost, createCommentPost } = await loadFixture(deployFixture);
            const standalonePost = await createStandalonePost(accounts[0].address, []);
            const commentPost = await createCommentPost(accounts[0].address, [], standalonePost.address);

            const erc165 = new ethers.Contract(commentPost.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it("Should revert if param _referencedPost is not a valid instance of the SocialNetworkPost contract (COMMENT)", async () => {
            const { accounts, createCommentPost } = await loadFixture(deployFixture);

            await expect(createCommentPost(accounts[0].address, [], ethers.constants.AddressZero)).to.be.reverted;
        });

        it(`Should create valid instance of SocialNetworkPost which supports the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost} (SHARE)`, async () => {
            const { accounts, createStandalonePost, createSharePost } = await loadFixture(deployFixture);
            const standalonePost = await createStandalonePost(accounts[0].address, []);
            const sharePost = await createSharePost(accounts[0].address, [], standalonePost.address);

            const erc165 = new ethers.Contract(sharePost.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it("Should revert if param _referencedPost is not a valid instance of the SocialNetworkPost contract (SHARE)", async () => {
            const { accounts, createSharePost } = await loadFixture(deployFixture);

            await expect(createSharePost(accounts[0].address, [], ethers.constants.AddressZero)).to.be.reverted;
        });

        it(`Should have STANDALONE (${SocialNetworkConstants.SocialNetworkPostType.STANDALONE}) as post type`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            expect(await post.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.STANDALONE);
        });

        it(`Should have COMMENT (${SocialNetworkConstants.SocialNetworkPostType.COMMENT}) as post type`, async () => {
            const { accounts, createStandalonePost, createCommentPost } = await loadFixture(deployFixture);

            const standalonePost = await createStandalonePost(accounts[0].address, []);
            const commentPost = await createCommentPost(accounts[0].address, [], standalonePost.address);

            expect(await commentPost.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.COMMENT);
        });

        it(`Should have SHARE (${SocialNetworkConstants.SocialNetworkPostType.SHARE}) as post type`, async () => {
            const { accounts, createStandalonePost, createSharePost } = await loadFixture(deployFixture);

            const standalonePost = await createStandalonePost(accounts[0].address, []);
            const sharePost = await createSharePost(accounts[0].address, [], standalonePost.address);

            expect(await sharePost.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.SHARE);
        });

        it("Should assign param _author to storage variable author", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            expect(await post.author()).to.eql(accounts[0].address);
        });

        it("Should set deployer's address as owner of post (owner != author)", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            expect(await post.owner()).to.eql(accounts[0].address);
        });

        it("Should set the LSP8TokenIdMetadata:MintedBy ERC725Y key value to param _author", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);
            const value = await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(accounts[0].address);
        });

        it("Should set the LSP8TokenIdMetadata:TokenId ERC725Y key value to own address", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);
            const value = await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(post.address);
        });

        it("Should set the SNPostContent ERC725Y key value to param _data", async () => {
            const { accounts, createStandalonePost, randomPostContentData } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);
            const value = await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent);
            expect(ethers.utils.arrayify(value)).to.eql(randomPostContentData);
        });

        it("Should add addresses of array param _taggedUsers to the SNUserTags enumerable set", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, [accounts[1].address, accounts[2].address]);
            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNUserTags;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                arraySecondIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(2), 16)])), 12),
                arrayThirdIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(3), 16)])), 12), // not in the enumerable set
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
                mapSecondAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[2].address])),
                mapThirdAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[3].address])), // not in the enumerable set
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(2), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.arraySecondIndex).to.hexEqual(accounts[2].address);
            expect(enumerableSetKeys.arrayThirdIndex).to.eql("0x"); // not in the enumerable set
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.mapSecondAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(2), 32));
            expect(enumerableSetKeys.mapThirdAddress).to.eql("0x"); // not in the enumerable set

            expect(await post.isUserTagged(accounts[1].address)).to.eql(true);
            expect(await post.isUserTagged(accounts[2].address)).to.eql(true);
            expect(await post.isUserTagged(accounts[3].address)).to.eql(false); // not in the enumerable set
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            await expect(createStandalonePost(accounts[0].address, [accounts[1].address, accounts[2].address, accounts[3].address, accounts[4].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            await expect(createStandalonePost(accounts[0].address, [accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createStandalonePost(accounts[0].address, [accounts[1].address, accounts[2].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createStandalonePost(accounts[0].address, [accounts[1].address, accounts[1].address, accounts[2].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createStandalonePost(accounts[0].address, [accounts[2].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createStandalonePost(accounts[0].address, [accounts[1].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });

    describe("function isUserTagged(address _user) external view returns (bool)", () => {
        it("Should return true if user was passed in the _taggedUsers array (constructor param)", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, [accounts[1].address]);

            expect(await post.isUserTagged(accounts[1].address)).to.eql(true);
        });

        it("Should return false if user was not passed in the _taggedUsers array (constructor param)", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            expect(await post.isUserTagged(accounts[1].address)).to.eql(false);
        });
    });

    describe("function addLike(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await expect(post.connect(accounts[1]).addLike(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNLikes enumerable set", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await post.isLikedBy(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNLikes enumerable set if the same address was added twice", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addLike(accounts[1].address);
            await post.addLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await post.isLikedBy(accounts[1].address)).to.eql(true);
        });
    });

    describe("function removeLike(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await expect(post.connect(accounts[1]).removeLike(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should remove address from the SNLikes enumerable set", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addLike(accounts[1].address);
            await post.removeLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await post.isLikedBy(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNLikes enumerable set if it was never added", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await post.isLikedBy(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNLikes enumerable set if it was removed before", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addLike(accounts[1].address);
            await post.removeLike(accounts[1].address);
            await post.removeLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await post.isLikedBy(accounts[1].address)).to.eql(false);
        });
    });

    describe("function isLikedBy(address _user) external view returns (bool)", () => {
        it("Should return true if post was liked by the given address", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);
            post.addLike(accounts[1].address);

            expect(await post.isLikedBy(accounts[1].address)).to.eql(true);
        });

        it("Should return false if post was not liked by the given address", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            expect(await post.isLikedBy(accounts[1].address)).to.eql(false);
        });
    });

    describe("function addComment(address _comment) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await expect(post.connect(accounts[1]).addComment(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNComments enumerable set", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addComment(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNComments;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
        });

        it("Should not add duplicate address to the SNComments enumerable set if the same address was added twice", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addComment(accounts[1].address);
            await post.addComment(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNComments;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
        });
    });

    describe("function addShare(address _share) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await expect(post.connect(accounts[1]).addShare(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNShares enumerable set", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addShare(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNShares;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
        });

        it("Should not add duplicate address to the SNShares enumerable set if the same address was added twice", async () => {
            const { accounts, createStandalonePost } = await loadFixture(deployFixture);

            const post = await createStandalonePost(accounts[0].address, []);

            await post.addShare(accounts[1].address);
            await post.addShare(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNShares;
            const enumerableSetKeys = {
                arrayLength: await post["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await post["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
        });
    });
});