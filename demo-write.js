import chains from "./chains.js";
import { ADAMIK_API_KEY } from "./env.js";

await getEncodedTransactions();

async function getEncodedTransactions() {
  // Loop over all available chains
  for (const chain of chains) {
    try {
      // Setup a self-transfer transaction, using all funds available
      const transactionData = {
        transaction: {
          data: {
            mode: "transfer",
            useMaxAmount: true,
            senderPubKey: chain.pubkey,
            senderAddress: chain.address,
            recipientAddress: chain.address,
          },
        },
      };

      // Call the Adamik API to create the ready-to-sign transaction
      const response = await fetch(
        `https://api.adamik.io/api/${chain.chainId}/transaction/encode`,
        {
          headers: { Authorization: ADAMIK_API_KEY },
          method: "POST",
          body: JSON.stringify(transactionData),
        }
      );

      if (response.status === 401) {
        console.log("Error: Invalid Adamik API key");
        return;
      }

      const result = await response.json();

      // Parse and format the result for console display
      parseResult(chain, result);
    } catch (error) {
      console.error(`Error on ${chain.chainId}:`, error);
    }
  }
}

function parseResult(chain, result) {
  console.log(`\n=== ${chain.chainId.toUpperCase()} Transaction to Sign ===`);

  if (result.status?.errors?.length > 0) {
    console.log(JSON.stringify(result.status.errors, null, 2));
  } else {
    console.log(result.transaction.encoded);
  }
}
