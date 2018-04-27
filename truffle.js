var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "Jrq8eWWBTmB9qV3jZBLW";
var mnemonic = "observe love mouse measure december observe habit verify fox ensure rich clinic";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
      ropsten:  {
      network_id: 3,
      host: "localhost",
      port:  8545,
      gas:   2900000,
    }
  },
  rpc: {
    host: 'localhost',
    post:8080
  }
};
