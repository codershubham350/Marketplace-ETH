const keys = require("./keys.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    // ropsten: {
    //   provider: () =>
    //     new HDWalletProvider({
    //       mnemonic: {
    //         phrase: "",
    //       },
    //       providerOrUrl: "https://ropsten.infura.io/v3/YOUR-PROJECT-ID",
    //       addressIndex: 0,
    //     }),
    //   network_id: 3,
    //   gas: 5500000, // Gas Limit, How much gas we are willing to spent
    //   gasPrice: 20000000000, // how much we are willing to spent for unit of gas (20Gwei)
    //   confirmations: 2, // number of blocks to wait between deployment
    //   timeoutBlocks: 200, // number of blocks before deployment times out
    // },
    live: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC,
          },
          providerOrUrl: `wss://mainet.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0,
        }),
      network_id: 1,
      gas: 2500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 2000000000, // how much we are willing to spent for unit of gas (2.5 Gwei)
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200, // number of blocks before deployment times out
      skipDryRun: true,
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC,
          },
          providerOrUrl: `wss://sepolia.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0,
        }),
      network_id: "11155111",
      gasPrice: 2500000000, // how much we are willing to spent for unit of gas (2.5 Gwei)
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200, // number of blocks before deployment times out
    },
  },

  compilers: {
    solc: {
      version: "0.8.4", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};

// Ropsten Example
// 5500000(Gas) * 20000000000(GasPrice) = 1.1e+17 or 1,10,00,00,00,00,00,00,000 or 0.11(ETH) => $204.87(USD)

// Contract Deployment
// transaction hash:    0x20ea06bf26075ce718aa2ee21b8e1e81519182b5ac7ee7173d67d5c5b41b57f1
// contract address:    0x7F3c19F4F76894E5f7Bc4261641e953b35Ce3E2a

// Sepolia Transaction
// BASE FEE (determined by ethereum) => 39.791392694

// Max Priority Fee Per Gas => 2 Gwei (0.000000002 ETH)

// GAS PRICE = BASE FEE + TIP => 41.791392694

// GAS USED = 21,000

// Transaction Fee = GAS USED * GAS PRICE = 21,000 * 41.791392694 = 0.000000039791392694 * 21000
//                                          0.000835619246574

// BURNT FEE => BASE FEE * GAS USED = 39.791392694 * 21000

// REST TO MINER = TIP * GAS USED = 2 * 21000
