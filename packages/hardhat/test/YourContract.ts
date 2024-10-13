import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking_ERC20", function () {
  async function deployContractAndSetVariables() {
    const Staking = await ethers.getContractFactory("StakingContract");
    const staking = await Staking.deploy(2000);

    const [owner] = await ethers.getSigners();

    console.log("Signer 1 address: ", owner.address);
    return { staking, owner };
  }

  it("Stake", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    console.log(owner);

    expect(await staking.stake(100)).to.equal("Valor esperado");
  });

  it("Unstake", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    console.log(owner);
    staking.stake(1000);
    const testTokens = 100;
    await staking.unstake(testTokens);
    expect(900).to.equal(900);
  });

  it("ClaimReward", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    console.log(owner);

    expect(await staking.claimReward()).to.equal("Valor esperado");
  });
});
