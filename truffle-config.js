const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const address = "0xE3bfFA2506739643d6c6FdcA45F84ECFE7dcBc5F";
const privateKey =
  "eb811da4f69a14ace52b3c13250e417795c2a88c32c13fa184e251176e4d2d62";

const provider = new HDWalletProvider(
  privateKey,
  "https://rinkeby.infura.io/v3/9f23d5afa645498b958a2b18a6d0d78a"
);

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  contracts_build_directory: path.join(__dirname, "/server/contracts"),
  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    rinkeby: {
      provider: () => provider,
      network_id: 4, // Rinkeby's id
      gas: 5500000,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11",
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
