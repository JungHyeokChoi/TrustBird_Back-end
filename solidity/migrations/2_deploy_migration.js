const TrustBird = artifacts.require("TrustBird");

module.exports = function(deployer) {
  deployer.deploy(TrustBird);
};
