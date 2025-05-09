import chains from "./chains.js";
import { ADAMIK_API_KEY } from "./env.js";

await getChainsData();

async function getChainsData() {
  // Loop over all available chains
  for (const chain of chains) {
    try {
      // Call the Adamik API to get all data for the chain's address
      const response = await fetch(
        `https://api.adamik.io/api/${chain.chainId}/account/${chain.address}/state`,
        { headers: { Authorization: ADAMIK_API_KEY } }
      );

      if (response.status === 401) {
        console.log("Error: Invalid Adamik API key");
        return;
      }

      const result = await response.json();

      // Parse and format the result for console display
      parseResult(chain, result);
    } catch (error) {
      console.error(`Error fetching ${chain.chainId}:`, error);
    }
  }
}

function parseResult(chain, result) {
  console.log(
    `\n=== ${chain.chainId.toUpperCase()} Account State (${chain.address}) ===`
  );

  // Display native balance information
  if (result.balances.native) {
    console.log("\nNative Balance:");
    console.log(`  Available: ${result.balances.native.available}`);
    if (result.balances.native.unconfirmed) {
      console.log(`  Unconfirmed: ${result.balances.native.unconfirmed}`);
    }
    console.log(`  Total: ${result.balances.native.total}`);
  }

  // Display token balances if any
  if (result.balances.tokens && result.balances.tokens.length > 0) {
    console.log("\nToken Balances:");
    result.balances.tokens.forEach((tokenAmount) => {
      console.log(
        `  ${tokenAmount.token.ticker}: ${tokenAmount.amount} (${tokenAmount.token.name})`
      );
    });
  }

  // Display staking information if any
  if (result.balances.staking) {
    // Staking balances
    console.log("\nStaking Information:");
    console.log(`  Total Staked: ${result.balances.staking.total}`);
    console.log(`  Locked: ${result.balances.staking.locked}`);
    console.log(`  Unlocking: ${result.balances.staking.unlocking}`);
    console.log(`  Unlocked: ${result.balances.staking.unlocked}`);

    // Staking positions
    if (result.balances.staking.positions.length > 0) {
      console.log("\n  Staking Positions:");
      result.balances.staking.positions.forEach((position, index) => {
        console.log(`    Position ${index + 1}:`);
        console.log(`      Amount: ${position.amount}`);
        console.log(`      Status: ${position.status}`);
        console.log(
          `      Validators: ${position.validatorAddresses.join(", ")}`
        );
        if (position.completionDate) {
          console.log(
            `      Completion Date: ${new Date(
              position.completionDate
            ).toLocaleString()}`
          );
        }
      });
    }

    // Staking pending rewards
    if (result.balances.staking.rewards) {
      if (result.balances.staking.rewards.native.length > 0) {
        console.log("\n  Native Rewards:");
        result.balances.staking.rewards.native.forEach((reward) => {
          console.log(
            `    Validator ${reward.validatorAddress}: ${reward.amount}`
          );
        });
      }

      if (result.balances.staking.rewards.tokens.length > 0) {
        console.log("\n  Token Rewards:");
        result.balances.staking.rewards.tokens.forEach((reward) => {
          console.log(
            `    ${reward.token.ticker} from Validator ${reward.validatorAddress}: ${reward.amount}`
          );
        });
      }
    }
  }
}
