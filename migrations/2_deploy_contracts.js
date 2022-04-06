const CryptoPainter = artifacts.require("CryptoPainter");

module.exports = function (deployer) {
  deployer.deploy(CryptoPainter);
};
