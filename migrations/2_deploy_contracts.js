const Nugget = artifacts.require("Nugget");

module.exports = function (deployer) {
  deployer.deploy(Nugget);
};
