const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  function tokens(n) {
    return web3.utils.toWei(n, "ether");
  }

  before(async () => {
    // load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //transfer all dapp to farm
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    //transfer tokens to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Mock DAI Deployment", async () => {
    it("has name", async () => {
      let name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("DApp Deployment", async () => {
    it("has name", async () => {
      let name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("TokenFarm Deployment", async () => {
    it("has name", async () => {
      let name = await tokenFarm.name();
      assert.equal(name, "DApp Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming Tokens", async () => {
    it("investor can deposite 100 DAI tokens for staking", async () => {
      let results;
      results = await daiToken.balanceOf(investor);
      assert.equal(
        results.toString(),
        tokens("100"),
        "incorrect mock DAI balance before staking"
      );

      // transfer token to farm
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      results = await daiToken.balanceOf(investor);
      assert.equal(
        results.toString(),
        tokens("0"),
        "incorrect dai investor balance after stake"
      );

      results = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        results.toString(),
        tokens("100"),
        "incorrect dai farm balance after stake"
      );

      results = await tokenFarm.stakingBalance(investor);
      assert.equal(
        results.toString(),
        tokens("100"),
        "incorrect staking farm balance after stake"
      );

      results = await tokenFarm.isStaking(investor);
      assert.equal(
        results.toString(),
        "true",
        "investor not currently marked as staking"
      );
    });

    it("investor can receive dapp token payment", async () => {
      let result;
      result = await dappToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor dapp wallet incorrect before issuence"
      );

      await tokenFarm.issueTokens({ from: owner });

      result = await dappToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor dapp wallet incorrect after issuence"
      );

      // check permissions
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
    });

    it("investor can unstake all dai", async () => {
      let result;
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor dai wallet incorrect before unstake"
      );

      await tokenFarm.unstakeTokens({ from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor dai wallet incorrect after unstaking"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "token farm dai wallet incorrect after unstaking"
      );
    });
  });
});
