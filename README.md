**Solana Token Minting and Transfer**
This project demonstrates how to mint and transfer SPL tokens on the Solana blockchain using @solana/web3.js and @solana/spl-token libraries.

**Features**
MintToken
Mint SPL Tokens: Create new SPL tokens with customizable decimal precision.
Authority Management: Set the mint and freeze authorities for token control.
Auto Account Creation: Automatically creates associated token accounts if they don't exist.

**TransferToken**

Transfer SPL Tokens: Send SPL tokens from one account to another.
Dynamic Decimal Fetching: Fetch token decimals from the token mint account to ensure accurate transfer amounts.
Transaction Confirmation: Confirms transactions on-chain and logs the transaction signature.
Auto Account Creation: Automatically creates associated token accounts for both sender and recipient.

**Prerequisites**

Node.js v16+
@solana/web3.js and @solana/spl-token libraries


