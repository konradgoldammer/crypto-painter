const config = require("config");
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const address = config.get("address");
const privateKey = config.get("privateKey");

module.exports = {
  contracts_build_directory: path.join(__dirname, "/server/contracts"),
  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(privateKey, config.get("infuraUrlRinkeby"));
      },
      network_id: 4, // Rinkeby's id
      gas: 5500000,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(privateKey, config.get("infuraUrlMainnet"));
      },
      gas: 5000000,
      gasPrice: 25000000000,
      confirmations: 2,
      network_id: 1,
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
