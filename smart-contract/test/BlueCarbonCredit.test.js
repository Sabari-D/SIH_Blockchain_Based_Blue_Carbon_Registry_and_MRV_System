const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blue Carbon Smart Contracts", function () {
  let BlueCarbonCredit, blueCarbonCredit;
  let VerifierRegistry, verifierRegistry;
  let CreditMarketplace, creditMarketplace;
  let owner, verifier, minter, user, buyer;

  beforeEach(async function () {
    [owner, verifier, minter, user, buyer] = await ethers.getSigners();

    VerifierRegistry = await ethers.getContractFactory("VerifierRegistry");
    verifierRegistry = await VerifierRegistry.deploy();
    await verifierRegistry.waitForDeployment();

    BlueCarbonCredit = await ethers.getContractFactory("BlueCarbonCredit");
    blueCarbonCredit = await BlueCarbonCredit.deploy();
    await blueCarbonCredit.waitForDeployment();

    CreditMarketplace = await ethers.getContractFactory("CreditMarketplace");
    creditMarketplace = await CreditMarketplace.deploy(
      await blueCarbonCredit.getAddress(),
      owner.address
    );
    await creditMarketplace.waitForDeployment();
  });

  describe("BlueCarbonCredit", function () {
    it("Should allow owner to grant MINTER_ROLE and allow minter to mint", async function () {
      const minterRole = await blueCarbonCredit.MINTER_ROLE();
      await blueCarbonCredit.grantRole(minterRole, minter.address);

      const amount = ethers.parseEther("100");
      await blueCarbonCredit.connect(minter).mint(user.address, amount, "project-123", "ipfs-cid-1");

      expect(await blueCarbonCredit.balanceOf(user.address)).to.equal(amount);
      const proj = await blueCarbonCredit.getProject("project-123");
      expect(proj.issued).to.be.true;
      expect(proj.evidenceHash).to.equal("ipfs-cid-1");
    });

    it("Should fail if non-minter attempts to mint", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        blueCarbonCredit.connect(user).mint(user.address, amount, "project-123", "ipfs-cid-1")
      ).to.be.reverted;
    });

    it("Should prevent double minting for the same project ID", async function () {
      const amount = ethers.parseEther("100");
      await blueCarbonCredit.mint(user.address, amount, "project-1", "ipfs-1");

      await expect(
        blueCarbonCredit.mint(user.address, amount, "project-1", "ipfs-2")
      ).to.be.revertedWith("Credits already issued for this project");
    });

    it("Should allow user to retire credits and track retired amount", async function () {
      const amount = ethers.parseEther("100");
      await blueCarbonCredit.mint(user.address, amount, "project-1", "ipfs-1");

      const retireAmount = ethers.parseEther("40");
      await blueCarbonCredit.connect(user).retire("project-1", retireAmount);

      expect(await blueCarbonCredit.balanceOf(user.address)).to.equal(ethers.parseEther("60"));
      const proj = await blueCarbonCredit.getProject("project-1");
      expect(proj.retired).to.be.true;
      expect(proj.retiredAmount).to.equal(retireAmount);
    });

    it("Should fail if user tries to retire more than balance", async function () {
      const amount = ethers.parseEther("50");
      await blueCarbonCredit.mint(user.address, amount, "project-1", "ipfs-1");

      const retireAmount = ethers.parseEther("60");
      await expect(
        blueCarbonCredit.connect(user).retire("project-1", retireAmount)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });

  describe("VerifierRegistry", function () {
    it("Should allow admin to add and remove verifiers", async function () {
      expect(await verifierRegistry.isVerifier(verifier.address)).to.be.false;

      await verifierRegistry.addVerifier(verifier.address);
      expect(await verifierRegistry.isVerifier(verifier.address)).to.be.true;

      await verifierRegistry.removeVerifier(verifier.address);
      expect(await verifierRegistry.isVerifier(verifier.address)).to.be.false;
    });
  });

  describe("CreditMarketplace", function () {
    it("Should allow sellers to list credits, and buyers to buy", async function () {
      const amount = ethers.parseEther("10");
      await blueCarbonCredit.mint(user.address, amount, "project-1", "ipfs-1");

      // Approve marketplace to spend
      await blueCarbonCredit.connect(user).approve(await creditMarketplace.getAddress(), amount);

      const pricePerCredit = ethers.parseEther("0.1"); // 0.1 ETH per full BCC
      await creditMarketplace.connect(user).listCredits(amount, pricePerCredit);

      const listing = await creditMarketplace.listings(1);
      expect(listing.seller).to.equal(user.address);
      expect(listing.amount).to.equal(amount);
      expect(listing.pricePerCredit).to.equal(pricePerCredit);
      expect(listing.active).to.be.true;

      // Purchase
      const totalPrice = (amount * pricePerCredit) / ethers.parseEther("1"); // 1 ETH total
      
      const initialBalance = await ethers.provider.getBalance(user.address);
      await creditMarketplace.connect(buyer).buyCredits(1, { value: totalPrice });

      expect(await blueCarbonCredit.balanceOf(buyer.address)).to.equal(amount);
      expect(await blueCarbonCredit.balanceOf(user.address)).to.equal(0);
      
      const finalBalance = await ethers.provider.getBalance(user.address);
      // user proceeds = totalPrice * 0.98 (since 2% fee is taken)
      const expectedProceeds = (totalPrice * 98n) / 100n;
      expect(finalBalance - initialBalance).to.equal(expectedProceeds);
    });
  });
});
