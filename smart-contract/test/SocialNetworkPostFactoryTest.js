// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const SocialNetworkPostABI = require("../artifacts/contracts/SocialNetworkPost.sol/SocialNetworkPost.json").abi;

// Helper
const { deploySocialNetworkPostFactoryTestWithLinkedLibraries } = require("../util/deploy");

describe("SocialNetworkPostFactoryTest", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const deployedSocialNetworkPostFactoryTest = await deploySocialNetworkPostFactoryTestWithLinkedLibraries(accounts[0].address);
        const randomPostContentData = ethers.utils.toUtf8Bytes("RANDOM POST CONTENT DATA");

        const createValidStandalonePost = async (author, postContentData, taggedUsers = []) => {
            const tx = await deployedSocialNetworkPostFactoryTest.createPost(author, postContentData, taggedUsers);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const validStandalonePost = new ethers.Contract(event.args.newPost, SocialNetworkPostInterface, accounts[0]);
            return validStandalonePost;
        };

        const createValidCommentPost = async (author, postContentData, taggedUsers = []) => {
            const referencedStandalonePost = await createValidStandalonePost(author, postContentData, taggedUsers);
            const tx = await deployedSocialNetworkPostFactoryTest.createCommentPost(author, postContentData, taggedUsers, referencedStandalonePost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const validCommentPost = new ethers.Contract(event.args.newPost, SocialNetworkPostInterface, accounts[0]);
            return { referencedStandalonePost, validCommentPost };
        };

        const createValidSharePost = async (author, postContentData, taggedUsers = []) => {
            const referencedStandalonePost = await createValidStandalonePost(author, postContentData, taggedUsers);
            const tx = await deployedSocialNetworkPostFactoryTest.createSharePost(author, postContentData, taggedUsers, referencedStandalonePost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const validSharePost = new ethers.Contract(event.args.newPost, SocialNetworkPostInterface, accounts[0]);
            return { referencedStandalonePost, validSharePost };
        };

        return {
            accounts,
            deployedSocialNetworkPostFactoryTest,
            randomPostContentData,
            createValidStandalonePost,
            createValidCommentPost,
            createValidSharePost
        };
    };

    describe("function createPost(address _author, bytes calldata _data, address[] calldata _taggedUsers) external returns (address)", () => {
        it("Should create instance of SocialNetworkPost contract and emit CreatedPost event", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData } = await loadFixture(deployFixture);

            await expect(deployedSocialNetworkPostFactoryTest.createPost(accounts[0].address, randomPostContentData, []))
                .to.emit(deployedSocialNetworkPostFactoryTest, "CreatedPost")
                .withArgs(accounts[0].address, anyValue);
        });

        it(`Should create valid instance of SocialNetworkPost which supports the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost}`, async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData } = await loadFixture(deployFixture);
            const tx = await deployedSocialNetworkPostFactoryTest.createPost(accounts[0].address, randomPostContentData, []);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");
            expect(event).not.to.be.null;
            expect(event.args.author).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newPost, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it(`Should have STANDALONE (${SocialNetworkConstants.SocialNetworkPostType.STANDALONE}) as post type`, async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            expect(await validStandalonePost.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.STANDALONE);
        });

        it("Should assign 'zero address' to storage variable referencedPost", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            expect(await validStandalonePost.referencedPost()).to.eql(ethers.constants.AddressZero);
        });

        it("Should assign param _author to storage variable author", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            expect(await validStandalonePost.author()).to.eql(accounts[0].address);
        });

        it("Should set SocialNetworkPostFactory contract instance's address as owner of post (owner != author)", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            expect(await validStandalonePost.owner()).to.eql(deployedSocialNetworkPostFactoryTest.address);
        });

        it("Should set the LSP8TokenIdMetadata:MintedBy ERC725Y key value to param _author", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            const value = await validStandalonePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(accounts[0].address);
        });

        it("Should set the LSP8TokenIdMetadata:TokenId ERC725Y key value to own address", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            const value = await validStandalonePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(validStandalonePost.address);
        });

        it("Should set the SNPostContent ERC725Y key value to param _data", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);
            const value = await validStandalonePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent);
            expect(ethers.utils.arrayify(value)).to.eql(randomPostContentData);
        });

        it("Should add addresses of array param _taggedUsers to the SNUserTags enumerable set", async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address]);

            expect(await validStandalonePost.isUserTagged(accounts[1].address)).to.eql(true);
            expect(await validStandalonePost.isUserTagged(accounts[2].address)).to.eql(true);
            expect(await validStandalonePost.isUserTagged(accounts[3].address)).to.eql(false); // not in the enumerable set
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[3].address, accounts[4].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[2].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[2].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidStandalonePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });

    describe("function createCommentPost(address _author, bytes calldata _data, address[] calldata _taggedUsers, address _referencedPost) external returns (address)", () => {
        it("Should revert if param _referencedPost is not a valid instance of the SocialNetworkPost contract", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData } = await loadFixture(deployFixture);

            await expect(deployedSocialNetworkPostFactoryTest.createCommentPost(accounts[0].address, randomPostContentData, [], accounts[1].address)).to.be.reverted;
        });

        it(`Should create valid instance of SocialNetworkPost if param _referencedPost is a valid instance of the SocialNetworkPost contract and thus both support the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost}`, async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);

            const tx = await deployedSocialNetworkPostFactoryTest.createCommentPost(accounts[0].address, randomPostContentData, [], validStandalonePost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");
            expect(event).not.to.be.null;
            expect(event.args.author).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newPost, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it(`Should have COMMENT (${SocialNetworkConstants.SocialNetworkPostType.COMMENT}) as post type`, async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            expect(await validCommentPost.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.COMMENT);
        });

        it("Should assign param _referencedPost to storage variable referencedPost", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost, referencedStandalonePost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            expect(await validCommentPost.referencedPost()).to.eql(referencedStandalonePost.address);
        });

        it("Should assign param _author to storage variable author", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            expect(await validCommentPost.author()).to.eql(accounts[0].address);
        });

        it("Should set SocialNetworkPostFactory contract instance's address as owner of post (owner != author)", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            expect(await validCommentPost.owner()).to.eql(deployedSocialNetworkPostFactoryTest.address);
        });

        it("Should set the LSP8TokenIdMetadata:MintedBy ERC725Y key value to param _author", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            const value = await validCommentPost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(accounts[0].address);
        });

        it("Should set the LSP8TokenIdMetadata:TokenId ERC725Y key value to own address", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            const value = await validCommentPost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(validCommentPost.address);
        });

        it("Should set the SNPostContent ERC725Y key value to param _data", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData);
            const value = await validCommentPost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent);
            expect(ethers.utils.arrayify(value)).to.eql(randomPostContentData);
        });

        it("Should add addresses of array param _taggedUsers to the SNUserTags enumerable set", async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            const { validCommentPost } = await createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address]);

            expect(await validCommentPost.isUserTagged(accounts[1].address)).to.eql(true);
            expect(await validCommentPost.isUserTagged(accounts[2].address)).to.eql(true);
            expect(await validCommentPost.isUserTagged(accounts[3].address)).to.eql(false); // not in the enumerable set
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[3].address, accounts[4].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContentData, createValidCommentPost } = await loadFixture(deployFixture);

            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[2].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[2].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidCommentPost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });

    describe("function createSharePost(address _author, bytes calldata _data, address[] calldata _taggedUsers, address _referencedPost) external returns (address)", () => {
        it("Should revert if param _referencedPost is not a valid instance of the SocialNetworkPost contract", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData } = await loadFixture(deployFixture);

            await expect(deployedSocialNetworkPostFactoryTest.createSharePost(accounts[0].address, randomPostContentData, [], accounts[1].address)).to.be.reverted;
        });

        it(`Should create valid instance of SocialNetworkPost if param _referencedPost is a valid instance of the SocialNetworkPost contract and thus both support the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost}`, async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData, createValidStandalonePost } = await loadFixture(deployFixture);

            const validStandalonePost = await createValidStandalonePost(accounts[0].address, randomPostContentData);

            const tx = await deployedSocialNetworkPostFactoryTest.createSharePost(accounts[0].address, randomPostContentData, [], validStandalonePost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");
            expect(event).not.to.be.null;
            expect(event.args.author).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newPost, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkPost)).to.be.equal(true);
        });

        it(`Should have SHARE (${SocialNetworkConstants.SocialNetworkPostType.SHARE}) as post type`, async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            expect(await validSharePost.postType()).to.eql(SocialNetworkConstants.SocialNetworkPostType.SHARE);
        });

        it("Should assign param _referencedPost to storage variable referencedPost", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost, referencedStandalonePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            expect(await validSharePost.referencedPost()).to.eql(referencedStandalonePost.address);
        });

        it("Should assign param _author to storage variable author", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            expect(await validSharePost.author()).to.eql(accounts[0].address);
        });

        it("Should set SocialNetworkPostFactory contract instance's address as owner of post (owner != author)", async () => {
            const { accounts, deployedSocialNetworkPostFactoryTest, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            expect(await validSharePost.owner()).to.eql(deployedSocialNetworkPostFactoryTest.address);
        });

        it("Should set the LSP8TokenIdMetadata:MintedBy ERC725Y key value to param _author", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            const value = await validSharePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(accounts[0].address);
        });

        it("Should set the LSP8TokenIdMetadata:TokenId ERC725Y key value to own address", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            const value = await validSharePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId);
            expect(ethers.utils.hexDataSlice(value, 12)).to.hexEqual(validSharePost.address);
        });

        it("Should set the SNPostContent ERC725Y key value to param _data", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData);
            const value = await validSharePost["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent);
            expect(ethers.utils.arrayify(value)).to.eql(randomPostContentData);
        });

        it("Should add addresses of array param _taggedUsers to the SNUserTags enumerable set", async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            const { validSharePost } = await createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address]);

            expect(await validSharePost.isUserTagged(accounts[1].address)).to.eql(true);
            expect(await validSharePost.isUserTagged(accounts[2].address)).to.eql(true);
            expect(await validSharePost.isUserTagged(accounts[3].address)).to.eql(false); // not in the enumerable set
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[3].address, accounts[4].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContentData, createValidSharePost } = await loadFixture(deployFixture);

            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[2].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[2].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[2].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(createValidSharePost(accounts[0].address, randomPostContentData, [accounts[1].address, accounts[1].address, accounts[1].address])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });
});