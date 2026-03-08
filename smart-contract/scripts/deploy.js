async function main() {
    const BlueCarbonCredit = await ethers.getContractFactory("BlueCarbonCredit");

    console.log("Deploying contract...");

    const contract = await BlueCarbonCredit.deploy();

    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("BlueCarbonCredit deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});