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
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(privateKey, config.get("infuraUrlMainnet"));
      },
      // gas: 5000000,
      // gasPrice: 25000000000,
      confirmations: 2,
      network_id: 1,
    },
    bscTestnet: {
      provider: () => {
        return new HDWalletProvider(
          privateKey,
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        );
      },
      network_id: 97,
      timeoutBlocks: 200,
      confirmations: 10,
    },
    bsc: {
      provider: () => {
        return new HDWalletProvider(
          privateKey,
          "wss://bsc-ws-node.nariox.org:443"
        );
      },
      network_id: 56,
      gas: 5500000,
      confirmations: 10,
      timeoutBlocks: 200,
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://rpc-mumbai.maticvigil.com/v1/8fb4e7e0c13fe8878f9b13c6f91154827ba88e26`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
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
