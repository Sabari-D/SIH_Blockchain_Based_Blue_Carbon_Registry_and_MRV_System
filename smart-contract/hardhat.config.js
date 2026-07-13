require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

const RPC_URL = process.env.RPC_URL || "";
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    amoy: {
      url: RPC_URL,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : []
    }
  }
};
