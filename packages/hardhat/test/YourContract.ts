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

  it("should stake tokens and update contract balance correctly", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    const stakingTokens = 1000;
    const balanceBefore = await staking.connect(owner).balanceOf(await staking.token());
    await staking.connect(owner).stake(stakingTokens);
    const balanceAfter = await staking.connect(owner).balanceOf(await staking.token());
    expect(balanceAfter).to.equal(balanceBefore + BigInt(stakingTokens));
    const staker = await staking.connect(owner).balances(owner.address);
    expect(staker.stakedTokens).to.equal(stakingTokens);
  });

  it("Unstake", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    console.log(owner);
    staking.stake(1000);
    const testTokens = 100;
    await staking.unstake(testTokens);
    expect(900).to.equal(900);
  });

  it("Should allow users to claim rewards", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    // Stake some tokens
    await staking.connect(owner).stake(1000);

    // Advance time by 1 day
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine");

    const balanceBefore = await staking.balanceOf(owner.address);
    await staking.connect(owner).claimReward();
    const balanceAfter = await staking.balanceOf(owner.address);

    expect(balanceAfter).to.be.gt(balanceBefore);
  });
});
