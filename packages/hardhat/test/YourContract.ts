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

    expect(await staking.unstake(100)).to.equal("Valor esperado");
  });

  it("ClaimReward", async function () {
    const { staking, owner } = await loadFixture(deployContractAndSetVariables);
    console.log(owner);

    expect(await staking.claimReward()).to.equal("Valor esperado");
  });
});
