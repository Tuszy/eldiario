// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Constants
const SocialNetworkConstants = require("../constants/SocialNetworkConstants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;

// Helper
const { deploySocialNetworkProfileDataWithLinkedLibraries } = require("../util/deploy");

describe("SocialNetworkProfileData", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const createProfileData = async (user) => {
            return await deploySocialNetworkProfileDataWithLinkedLibraries(accounts[0].address, user);
        };

        return {
            accounts,
            createProfileData
        };
    };

    describe("constructor(address _owner, address _user) ERC725YEnumerableSetUtil(_owner)", () => {
        it(`Should create valid instance of SocialNetworkProfileData which supports the interface id: ${SocialNetworkConstants.INTERFACE_IDS.SocialNetworkProfileData}`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);
            const profileData = await createProfileData(accounts[1].address);

            const erc165 = new ethers.Contract(profileData.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(SocialNetworkConstants.INTERFACE_IDS.SocialNetworkProfileData)).to.be.equal(true);
        });

        it("Should assign param _user to storage variable user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[1].address);

            expect(await profileData.user()).to.eql(accounts[1].address);
        });

        it("Should set deployer's address as owner of post (owner != author)", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[1].address);

            expect(await profileData.owner()).to.eql(accounts[0].address);
        });
    });

    describe("function addLike(address _post) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).addLike(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNLikes enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNLikes enumerable set if the same address was added twice", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addLike(accounts[1].address);
            await profileData.addLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(true);
        });
    });

    describe("function removeLike(address _post) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).removeLike(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should remove address from the SNLikes enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addLike(accounts[1].address);
            await profileData.removeLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNLikes enumerable set if it was never added", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNLikes enumerable set if it was removed before", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addLike(accounts[1].address);
            await profileData.removeLike(accounts[1].address);
            await profileData.removeLike(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNLikes;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(false);
        });
    });

    describe("function hasLiked(address _post) external view returns (bool)", () => {
        it("Should return true if the given address was liked by the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addLike(accounts[1].address);

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the given address was not liked by the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.hasLiked(accounts[1].address)).to.eql(false);
        });
    });

    describe("function addSubscription(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).addSubscription(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNSubscriptions enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscription(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscriptions;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNSubscriptions enumerable set if the same address was added twice", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscription(accounts[1].address);
            await profileData.addSubscription(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscriptions;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(true);
        });
    });

    describe("function removeSubscription(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).removeSubscription(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should remove address from the SNSubscriptions enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscription(accounts[1].address);
            await profileData.removeSubscription(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscriptions;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNSubscriptions enumerable set if it was never added", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscriptions;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNSubscriptions enumerable set if it was removed before", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscription(accounts[1].address);
            await profileData.removeSubscription(accounts[1].address);
            await profileData.removeSubscription(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscriptions;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(false);
        });
    });

    describe("function isSubscriberOf(address _user) external view returns (bool)", () => {
        it("Should return true if the given address was subscribed by the the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addSubscription(accounts[1].address);

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the given address was not subscribed by the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.isSubscriberOf(accounts[1].address)).to.eql(false);
        });
    });

    describe("function addSubscriber(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).addSubscriber(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNSubscribers enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscriber(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscribers;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNSubscribers enumerable set if the same address was added twice", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscriber(accounts[1].address);
            await profileData.addSubscriber(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscribers;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(true);
        });
    });

    describe("function removeSubscriber(address _user) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).removeSubscriber(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should remove address from the SNSubscribers enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscriber(accounts[1].address);
            await profileData.removeSubscriber(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscribers;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNSubscribers enumerable set if it was never added", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscribers;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(false);
        });

        it("Should ignore removal of address from the SNSubscribers enumerable set if it was removed before", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addSubscriber(accounts[1].address);
            await profileData.removeSubscriber(accounts[1].address);
            await profileData.removeSubscriber(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNSubscribers;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql("0x");
            expect(enumerableSetKeys.arrayFirstIndex).to.eql("0x");
            expect(enumerableSetKeys.mapFirstAddress).to.eql("0x");

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(false);
        });
    });

    describe("function isSubscribedBy(address _user) external view returns (bool)", () => {
        it("Should return true if the given address was subscribed to the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addSubscriber(accounts[1].address);

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the given address was not subscribed to the user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.isSubscribedBy(accounts[1].address)).to.eql(false);
        });
    });

    describe("function addPost(address _post) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).addPost(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNPosts enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addPost(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNPosts;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isAuthorOf(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNPosts enumerable set if the same address was added twice", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addPost(accounts[1].address);
            await profileData.addPost(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNPosts;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isAuthorOf(accounts[1].address)).to.eql(true);
        });
    });

    describe("function isAuthorOf(address _post) external view returns (bool)", () => {
        it("Should return true if the user is author of the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addPost(accounts[1].address);

            expect(await profileData.isAuthorOf(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the user is not author of the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.isAuthorOf(accounts[1].address)).to.eql(false);
        });
    });











    describe("function addTag(address _post) external onlyOwner", () => {
        it(`Should revert with '${SocialNetworkConstants.Errors.Modifier.OnlyOwner}' if the function was not called by the owner`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await expect(profileData.connect(accounts[1]).addTag(accounts[2].address)).to.be.revertedWith(SocialNetworkConstants.Errors.Modifier.OnlyOwner);
        });

        it("Should add address to the SNUserTags enumerable set", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addTag(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNUserTags;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isTaggedIn(accounts[1].address)).to.eql(true);
        });

        it("Should not add duplicate address to the SNUserTags enumerable set if the same address was added twice", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            await profileData.addTag(accounts[1].address);
            await profileData.addTag(accounts[1].address);

            const enumerableSet = SocialNetworkConstants.ERC725YKeys.EnumerableSet.SNUserTags;
            const enumerableSetKeys = {
                arrayLength: await profileData["getData(bytes32)"](enumerableSet.Array.length),
                arrayFirstIndex: ethers.utils.hexDataSlice(await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Array.index, ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 16)])), 12),
                mapFirstAddress: await profileData["getData(bytes32)"](ethers.utils.concat([enumerableSet.Map, accounts[1].address])),
            };
            expect(enumerableSetKeys.arrayLength).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));
            expect(enumerableSetKeys.arrayFirstIndex).to.hexEqual(accounts[1].address);
            expect(enumerableSetKeys.mapFirstAddress).to.eql(ethers.utils.hexZeroPad(ethers.utils.hexValue(1), 32));

            expect(await profileData.isTaggedIn(accounts[1].address)).to.eql(true);
        });
    });

    describe("function isTaggedIn(address _post) external view returns (bool)", () => {
        it("Should return true if the user tagged in the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addTag(accounts[1].address);

            expect(await profileData.isTaggedIn(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the user was tagged in the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.isTaggedIn(accounts[1].address)).to.eql(false);
        });
    });
});