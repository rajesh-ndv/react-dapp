const Alanytics = artifacts.require("Analytics");

module.exports = function(deployer) {
  deployer.deploy(Alanytics);
};