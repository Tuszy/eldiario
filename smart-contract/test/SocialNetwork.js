// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");
const { ERC725YKeys } = require("@lukso/lsp-smart-contracts/constants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const SocialNetworkPostABI = require("../artifacts/contracts/SocialNetworkPost.sol/SocialNetworkPost.json").abi;
const ISocialNetworkProfileDataABI = require("../artifacts/contracts/ISocialNetworkProfileData.sol/ISocialNetworkProfileData.json").abi;

// Helper
const { deploySocialNetworkWithLinkedLibraries } = require("../util/deploy");
const { getOwnerAndUniversalProfiles } = require("../test-util/universal-profile");

describe("SocialNetwork", () => {
    const deployFixture = async () => {
        const constructorParam = ethers.utils.arrayify("0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553");
        const deployedSocialNetworkWithLinkedLibraries = await deploySocialNetworkWithLinkedLibraries(constructorParam);
        const ownerAndUniversalProfiles = await getOwnerAndUniversalProfiles(deployedSocialNetworkWithLinkedLibraries.socialNetwork);
        const randomPostContent = ethers.utils.toUtf8Bytes("");

        return {
            ...ownerAndUniversalProfiles,
            ...deployedSocialNetworkWithLinkedLibraries,
            constructorParam,
            randomPostContent
        };
    };

    describe("constructor(bytes memory _LSP4MetadataJSONURL)", () => {
        it(`Should set the LSP4TokenName ERC725Y key value to '${SocialNetworkConstants.ERC725YValues.LSP4.TokenName}'`, async () => {
            const { socialNetwork } = await loadFixture(deployFixture);

            const value = await socialNetwork["getData(bytes32)"](ERC725YKeys.LSP4.LSP4TokenName);
            expect(ethers.utils.toUtf8String(value)).to.eql(SocialNetworkConstants.ERC725YValues.LSP4.TokenName);
        });

        it(`Should set the LSP4TokenSymbol ERC725Y key value to '${SocialNetworkConstants.ERC725YValues.LSP4.TokenSymbol}'`, async () => {
            const { socialNetwork } = await loadFixture(deployFixture);

            const value = await socialNetwork["getData(bytes32)"](ERC725YKeys.LSP4.LSP4TokenSymbol);
            expect(ethers.utils.toUtf8String(value)).to.eql(SocialNetworkConstants.ERC725YValues.LSP4.TokenSymbol);
        });

        it("Should set the LSP4Metadata ERC725Y key value to the first param of the constructor", async () => {
            const { socialNetwork, constructorParam } = await loadFixture(deployFixture);

            const value = await socialNetwork["getData(bytes32)"](ERC725YKeys.LSP4.LSP4Metadata);
            expect(ethers.utils.arrayify(value)).to.eql(constructorParam);
        });

        it(`Should set the LSP8TokenIdType ERC725Y key value to ${SocialNetworkConstants.LSP8TokenIdTypeAddress} (address)`, async () => {
            const { socialNetwork } = await loadFixture(deployFixture);

            const value = await socialNetwork["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Type);
            expect(value).to.eql(ethers.utils.hexZeroPad(SocialNetworkConstants.LSP8TokenIdTypeAddress, 32));
        });

        it(`Should support SocialNetwork interface '${SocialNetworkConstants.INTERFACE_IDS.SocialNetwork}'`, async () => {
            const { owner, socialNetwork } = await loadFixture(deployFixture);

            const erc165 = new ethers.Contract(socialNetwork.address, IERC165ABI, owner);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetwork)).to.be.equal(true);
        });
    });

    describe("function register() external returns (address)", async () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressIsAnEOA}' if user is an EOA`, async () => {
            const { socialNetwork } = await loadFixture(deployFixture);
            await expect(socialNetwork.register()).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressIsAnEOA);
        });

        it("Should not revert if calling user is a valid universal profile", async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].register()).to.be.not.reverted;
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressAlreadyRegistered}' if user is already registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].register()).to.be.not.reverted;
            await expect(accounts[0].register()).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressAlreadyRegistered);
        });

        it("Should increase the 'registeredUserCount' by one after successful registration", async () => {
            const { socialNetwork, accounts } = await loadFixture(deployFixture);

            expect(await socialNetwork.registeredUserCount()).to.be.equal(0);
            await accounts[0].register();
            expect(await socialNetwork.registeredUserCount()).to.be.equal(1);
        });

        it("Should add the universal profile to the 'registeredUsers' map after successful registration", async () => {
            const { socialNetwork, accounts } = await loadFixture(deployFixture);

            expect(await socialNetwork.registeredUsers(accounts[0].universalProfileAddress)).to.be.equal(ethers.constants.AddressZero);
            await accounts[0].register();
            expect(await socialNetwork.registeredUsers(accounts[0].universalProfileAddress)).not.to.be.equal(ethers.constants.AddressZero);
        });

        it("Should deploy instance of SocialNetworkProfileData after successful registration", async () => {
            const { owner, socialNetwork, accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            const socialNetworkProfileDataAddress = await socialNetwork.registeredUsers(accounts[0].universalProfileAddress);
            const erc165 = new ethers.Contract(socialNetworkProfileDataAddress, IERC165ABI, owner);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkProfileData)).to.be.equal(true);
        });

        it("Should link instance of SocialNetworkProfileData to universal profile after successful registration", async () => {
            const { owner, socialNetwork, accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            const socialNetworkProfileDataAddress = await socialNetwork.registeredUsers(accounts[0].universalProfileAddress);
            const socialNetworkProfileData = new ethers.Contract(socialNetworkProfileDataAddress, ISocialNetworkProfileDataABI, owner);
            expect(await socialNetworkProfileData.user()).to.be.equal(accounts[0].universalProfileAddress);
        });

        it("Should emit UserRegistered event after successful registration", async () => {
            const { socialNetwork, accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("register"))
                .to.emit(socialNetwork, "UserRegistered")
                .withArgs(accounts[0].universalProfileAddress, anyValue, 1, anyValue);
        });
    });

    describe("function likePost(address _post) external onlyRegisteredUser(msg.sender) onlyValidPost(_post) onlyNotPostAuthor(msg.sender, _post) onlyNotLikedPost(msg.sender, _post)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("likePost", ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should revert if post address is an EOA", async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("likePost", ethers.constants.AddressZero)).to.be.reverted;
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid}' if post address is not valid`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("likePost", accounts[1].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserIsAuthor}' if user is the author of the post`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            await expect(accounts[0].executeCallThroughKeyManager("likePost", post.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserIsAuthor);
        });

        it("Should add like to post and emit 'UserLikedPost' event if user has not already liked it", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            const socialProfile = await accounts[1].register();
            await expect(accounts[1].executeCallThroughKeyManager("likePost", post.address))
                .to.emit(socialNetwork, "UserLikedPost")
                .withArgs(accounts[1].universalProfileAddress, post.address, anyValue);

            expect(await post.isLikedBy(accounts[1].universalProfileAddress)).to.be.equal(true);
            expect(await socialProfile.hasLiked(post.address)).to.be.equal(true);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserLikedPost}' if a user has already liked a post`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            await accounts[1].register();
            await accounts[1].executeCallThroughKeyManager("likePost", post.address);

            await expect(accounts[1].executeCallThroughKeyManager("likePost", post.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserLikedPost);
        });
    });

    describe("function unlikePost(address _post) external onlyRegisteredUser(msg.sender) onlyValidPost(_post) onlyNotPostAuthor(msg.sender, _post) onlyLikedPost(msg.sender, _post)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("unlikePost", ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should revert if post address is an EOA", async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("unlikePost", ethers.constants.AddressZero)).to.be.reverted;
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid}' if post address is not valid`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("unlikePost", accounts[1].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserIsAuthor}' if user is the author of the post`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            await expect(accounts[0].executeCallThroughKeyManager("unlikePost", post.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserIsAuthor);
        });

        it("Should remove like from post and emit 'UserUnlikedPost' event if user has liked it before", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            const socialProfile = await accounts[1].register();
            await accounts[1].executeCallThroughKeyManager("likePost", post.address);
            await expect(accounts[1].executeCallThroughKeyManager("unlikePost", post.address))
                .to.emit(socialNetwork, "UserUnlikedPost")
                .withArgs(accounts[1].universalProfileAddress, post.address, anyValue);

            expect(await post.isLikedBy(accounts[1].universalProfileAddress)).to.be.equal(false);
            expect(await socialProfile.hasLiked(post.address)).to.be.equal(false);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserNotLikedPost}' if user has not liked the post`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const post = await accounts[0].createStandalonePost(randomPostContent);

            await accounts[1].register();

            await expect(accounts[1].executeCallThroughKeyManager("unlikePost", post.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserNotLikedPost);
        });
    });

    describe("function subscribeUser(address _user) external onlyRegisteredUser(msg.sender) onlyRegisteredUser(_user) onlyNotSubscribedUser(msg.sender, _user)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user (msg.sender) is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("subscribeUser", ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if target user is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("subscribeUser", accounts[1].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should add subscription and emit 'UserSubscribedUser' event if user has not already subscribed the target user", async () => {
            const { socialNetwork, accounts } = await loadFixture(deployFixture);

            const socialProfile1 = await accounts[0].register();
            const socialProfile2 = await accounts[1].register();

            await expect(accounts[1].executeCallThroughKeyManager("subscribeUser", accounts[0].universalProfileAddress))
                .to.emit(socialNetwork, "UserSubscribedUser")
                .withArgs(accounts[1].universalProfileAddress, accounts[0].universalProfileAddress, anyValue);

            expect(await socialProfile1.isSubscribedBy(accounts[1].universalProfileAddress)).to.be.equal(true);
            expect(await socialProfile2.isSubscriberOf(accounts[0].universalProfileAddress)).to.be.equal(true);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserIsSubscriber}' if user has already subscribed the target user`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await accounts[1].register();
            await accounts[1].executeCallThroughKeyManager("subscribeUser", accounts[0].universalProfileAddress);

            await expect(accounts[1].executeCallThroughKeyManager("subscribeUser", accounts[0].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserIsSubscriber);
        });
    });

    describe("function unsubscribeUser(address _user) external onlyRegisteredUser(msg.sender) onlyRegisteredUser(_user) onlySubscribedUser(msg.sender, _user)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user (msg.sender) is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("unsubscribeUser", ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if target user is not registered`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("unsubscribeUser", accounts[1].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should remove subscription and emit 'UserUnsubscribedUser' event if user has subscribed the target user before", async () => {
            const { socialNetwork, accounts } = await loadFixture(deployFixture);

            const socialProfile1 = await accounts[0].register();
            const socialProfile2 = await accounts[1].register();

            await accounts[1].executeCallThroughKeyManager("subscribeUser", accounts[0].universalProfileAddress);
            await expect(accounts[1].executeCallThroughKeyManager("unsubscribeUser", accounts[0].universalProfileAddress))
                .to.emit(socialNetwork, "UserUnsubscribedUser")
                .withArgs(accounts[1].universalProfileAddress, accounts[0].universalProfileAddress, anyValue);

            expect(await socialProfile1.isSubscribedBy(accounts[1].universalProfileAddress)).to.be.equal(false);
            expect(await socialProfile2.isSubscriberOf(accounts[0].universalProfileAddress)).to.be.equal(false);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserNotSubscriber}' if user has not subscribed the target user`, async () => {
            const { accounts } = await loadFixture(deployFixture);

            await accounts[0].register();

            await accounts[1].register();

            await expect(accounts[1].executeCallThroughKeyManager("unsubscribeUser", accounts[0].universalProfileAddress)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserNotSubscriber);
        });
    });




















    describe("function createPost(bytes calldata _data, address[] calldata _taggedUsers) external onlyRegisteredUser(msg.sender) returns (address)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user is not registered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should create a post of type STANDALONE and emit 'UserCreatedPost' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            const socialProfile = await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, []))
                .to.emit(socialNetwork, "UserCreatedPost")
                .withArgs(SocialNetworkConstants.SocialNetworkPostType.STANDALONE, accounts[0].universalProfileAddress, ethers.constants.AddressZero, anyValue, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialProfile.isAuthorOf(post.address)).to.be.equal(true);
            expect((await post.author())).to.hexEqual(accounts[0].universalProfileAddress);
            expect((await post.owner())).to.hexEqual(socialNetwork.address);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy), 12)).to.hexEqual(accounts[0].universalProfileAddress);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId), 12)).to.hexEqual(post.address);
            expect(ethers.utils.arrayify(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent))).to.eql(randomPostContent);
        });

        it("Should mint a LSP8 SocialNetwork NFT (Post) with the address as the token id and emit 'Transfer' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            expect(await socialNetwork.totalSupply()).to.equal(0);

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, []))
                .to.emit(socialNetwork, "Transfer")
                .withArgs(accounts[0].universalProfileAddress, ethers.constants.AddressZero, accounts[0].universalProfileAddress, anyValue, false, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialNetwork.totalSupply()).to.equal(1);
            expect(await socialNetwork.tokenOwnerOf(ethers.utils.hexZeroPad(post.address, 32))).to.hexEqual(accounts[0].universalProfileAddress);
        });

        it("Should add user tag to post and emit a 'UserTaggedUserInPost' for each registered user in the _taggedUsers array", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const taggedUserSocialProfile = await accounts[1].register();

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress]))
                .to.emit(socialNetwork, "UserTaggedUserInPost")
                .withArgs(accounts[0].universalProfileAddress, anyValue, accounts[1].universalProfileAddress, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await post.isUserTagged(accounts[1].universalProfileAddress)).to.equal(true);
            expect(await taggedUserSocialProfile.isTaggedIn(post.address)).to.eql(true);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if any user in the _taggedUsers array is unregistered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();
            await accounts[3].register();
            await accounts[4].register();

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[3].universalProfileAddress, accounts[4].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();

            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[1].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[2].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[2].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("createPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress])).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });

    describe("function commentPost(bytes calldata _data, address[] calldata _taggedUsers, address _targetPost) external onlyRegisteredUser(msg.sender) onlyValidPost(_targetPost) returns (address)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user is not registered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [], ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should create a post of type COMMENT and emit 'UserCreatedPost' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            const socialProfile = await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [], referencedPost.address))
                .to.emit(socialNetwork, "UserCreatedPost")
                .withArgs(SocialNetworkConstants.SocialNetworkPostType.COMMENT, accounts[0].universalProfileAddress, referencedPost.address, anyValue, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialProfile.isAuthorOf(post.address)).to.be.equal(true);
            expect((await post.author())).to.hexEqual(accounts[0].universalProfileAddress);
            expect((await post.owner())).to.hexEqual(socialNetwork.address);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy), 12)).to.hexEqual(accounts[0].universalProfileAddress);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId), 12)).to.hexEqual(post.address);
            expect(ethers.utils.arrayify(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent))).to.eql(randomPostContent);
        });

        it("Should mint a LSP8 SocialNetwork NFT (Post) with the address as the token id and emit 'Transfer' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            expect(await socialNetwork.totalSupply()).to.equal(0);

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            expect(await socialNetwork.totalSupply()).to.equal(1);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [], referencedPost.address))
                .to.emit(socialNetwork, "Transfer")
                .withArgs(accounts[0].universalProfileAddress, ethers.constants.AddressZero, accounts[0].universalProfileAddress, anyValue, false, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialNetwork.totalSupply()).to.equal(2);
            expect(await socialNetwork.tokenOwnerOf(ethers.utils.hexZeroPad(post.address, 32))).to.hexEqual(accounts[0].universalProfileAddress);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid}' if referenced post address is not an instance of SocialNetworkPost`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [], accounts[1].universalProfileAddress))
                .to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid);
        });

        it("Should revert if referenced post address is invalid (EOA)", async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [], ethers.constants.AddressZero))
                .to.be.reverted;
        });

        it("Should add user tag to post and emit a 'UserTaggedUserInPost' for each registered user in the _taggedUsers array", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);
            const taggedUserSocialProfile = await accounts[1].register();

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress], referencedPost.address))
                .to.emit(socialNetwork, "UserTaggedUserInPost")
                .withArgs(accounts[0].universalProfileAddress, anyValue, accounts[1].universalProfileAddress, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await post.isUserTagged(accounts[1].universalProfileAddress)).to.equal(true);
            expect(await taggedUserSocialProfile.isTaggedIn(post.address)).to.eql(true);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if any user in the _taggedUsers array is unregistered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();
            await accounts[3].register();
            await accounts[4].register();

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[3].universalProfileAddress, accounts[4].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[2].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[2].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("commentPost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });

    describe("function sharePost(bytes calldata _data, address[] calldata _taggedUsers, address _targetPost) external onlyRegisteredUser(msg.sender) onlyValidPost(_targetPost) returns (address)", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if user is not registered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [], ethers.constants.AddressZero)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it("Should create a post of type SHARE and emit 'UserCreatedPost' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            const socialProfile = await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [], referencedPost.address))
                .to.emit(socialNetwork, "UserCreatedPost")
                .withArgs(SocialNetworkConstants.SocialNetworkPostType.SHARE, accounts[0].universalProfileAddress, referencedPost.address, anyValue, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialProfile.isAuthorOf(post.address)).to.be.equal(true);
            expect((await post.author())).to.hexEqual(accounts[0].universalProfileAddress);
            expect((await post.owner())).to.hexEqual(socialNetwork.address);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy), 12)).to.hexEqual(accounts[0].universalProfileAddress);
            expect(ethers.utils.hexDataSlice(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId), 12)).to.hexEqual(post.address);
            expect(ethers.utils.arrayify(await post["getData(bytes32)"](SocialNetworkConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.SNPostContent))).to.eql(randomPostContent);
        });

        it("Should mint a LSP8 SocialNetwork NFT (Post) with the address as the token id and emit 'Transfer' event", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            expect(await socialNetwork.totalSupply()).to.equal(0);

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            expect(await socialNetwork.totalSupply()).to.equal(1);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [], referencedPost.address))
                .to.emit(socialNetwork, "Transfer")
                .withArgs(accounts[0].universalProfileAddress, ethers.constants.AddressZero, accounts[0].universalProfileAddress, anyValue, false, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await socialNetwork.totalSupply()).to.equal(2);
            expect(await socialNetwork.tokenOwnerOf(ethers.utils.hexZeroPad(post.address, 32))).to.hexEqual(accounts[0].universalProfileAddress);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid}' if referenced post address is not an instance of SocialNetworkPost`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [], accounts[1].universalProfileAddress))
                .to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.PostAddressNotValid);
        });

        it("Should revert if referenced post address is invalid (EOA)", async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [], ethers.constants.AddressZero))
                .to.be.reverted;
        });

        it("Should add user tag to post and emit a 'UserTaggedUserInPost' for each registered user in the _taggedUsers array", async () => {
            const { socialNetwork, accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);
            const taggedUserSocialProfile = await accounts[1].register();

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress], referencedPost.address))
                .to.emit(socialNetwork, "UserTaggedUserInPost")
                .withArgs(accounts[0].universalProfileAddress, anyValue, accounts[1].universalProfileAddress, anyValue);

            const eventFilter = socialNetwork.filters.UserCreatedPost();
            const events = await socialNetwork.queryFilter(eventFilter);

            const SocialNetworkPostInterface = new ethers.utils.Interface(SocialNetworkPostABI);
            const post = new ethers.Contract(events[events.length - 1].args.newPost, SocialNetworkPostInterface, accounts[0].universalProfileOwner);

            expect(await post.isUserTagged(accounts[1].universalProfileAddress)).to.equal(true);
            expect(await taggedUserSocialProfile.isTaggedIn(post.address)).to.eql(true);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered}' if any user in the _taggedUsers array is unregistered`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetwork.UserAddressNotRegistered);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged}' if more than 3 users have been tagged`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();
            await accounts[3].register();
            await accounts[4].register();

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[3].universalProfileAddress, accounts[4].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.MoreThan3UsersTagged);
        });

        it(`Should revert with '${SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged}' if two user tags are the same`, async () => {
            const { accounts, randomPostContent } = await loadFixture(deployFixture);

            await accounts[0].register();
            await accounts[1].register();
            await accounts[2].register();

            const referencedPost = await accounts[0].createStandalonePost(randomPostContent, []);

            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress, accounts[2].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[2].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[2].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
            await expect(accounts[0].executeCallThroughKeyManager("sharePost", randomPostContent, [accounts[1].universalProfileAddress, accounts[1].universalProfileAddress, accounts[1].universalProfileAddress], referencedPost.address)).to.be.revertedWith(SocialNetworkConstants.Errors.SocialNetworkPost.constructor.SameUsersTagged);
        });
    });
});