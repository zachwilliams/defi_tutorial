const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // deploy mock dai token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // deploy new dapp token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  // deploy token farm contract
  await deployer.deploy(TokenFarm, daiToken.address, dappToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // assign all dapp tokens to token farm (1 million)
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");

  // assign 100 mock dai tokens to an investor (100)
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
