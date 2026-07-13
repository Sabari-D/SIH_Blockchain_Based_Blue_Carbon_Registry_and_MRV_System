const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy VerifierRegistry
  const VerifierRegistry = await hre.ethers.getContractFactory("VerifierRegistry");
  const verifierRegistry = await VerifierRegistry.deploy();
  await verifierRegistry.waitForDeployment();
  const verifierRegistryAddress = await verifierRegistry.getAddress();
  console.log("VerifierRegistry deployed to:", verifierRegistryAddress);

  // Deploy BlueCarbonCredit
  const BlueCarbonCredit = await hre.ethers.getContractFactory("BlueCarbonCredit");
  const blueCarbonCredit = await BlueCarbonCredit.deploy();
  await blueCarbonCredit.waitForDeployment();
  const blueCarbonCreditAddress = await blueCarbonCredit.getAddress();
  console.log("BlueCarbonCredit deployed to:", blueCarbonCreditAddress);

  // Deploy CreditMarketplace
  const CreditMarketplace = await hre.ethers.getContractFactory("CreditMarketplace");
  const creditMarketplace = await CreditMarketplace.deploy(
    blueCarbonCreditAddress,
    deployer.address
  );
  await creditMarketplace.waitForDeployment();
  const creditMarketplaceAddress = await creditMarketplace.getAddress();
  console.log("CreditMarketplace deployed to:", creditMarketplaceAddress);

  // Add deployer as a verifier in VerifierRegistry for convenience
  await verifierRegistry.addVerifier(deployer.address);
  console.log("Added deployer as verifier");

  // Save config
  const config = {
    BlueCarbonCredit: blueCarbonCreditAddress,
    VerifierRegistry: verifierRegistryAddress,
    CreditMarketplace: creditMarketplaceAddress,
  };

  const outputDirBackend = path.resolve(__dirname, "../../backend/app");
  const outputDirFrontend = path.resolve(__dirname, "../../frontend/src");

  if (!fs.existsSync(outputDirBackend)) fs.mkdirSync(outputDirBackend, { recursive: true });
  if (!fs.existsSync(outputDirFrontend)) fs.mkdirSync(outputDirFrontend, { recursive: true });

  fs.writeFileSync(path.join(outputDirBackend, "contracts.json"), JSON.stringify(config, null, 2));
  fs.writeFileSync(path.join(outputDirFrontend, "contracts.json"), JSON.stringify(config, null, 2));

  // Write ABIs
  const artifacts = ["BlueCarbonCredit", "VerifierRegistry", "CreditMarketplace"];
  for (const name of artifacts) {
    const art = hre.artifacts.readArtifactSync(name);
    fs.writeFileSync(path.join(outputDirBackend, `${name}.json`), JSON.stringify(art.abi, null, 2));
    fs.writeFileSync(path.join(outputDirFrontend, `${name}.json`), JSON.stringify(art.abi, null, 2));
  }

  console.log("Contract metadata written to backend and frontend folders successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
