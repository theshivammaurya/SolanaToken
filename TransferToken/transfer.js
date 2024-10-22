const {Connection, PublicKey, clusterApiUrl, Keypair, Transaction, sendAndConfirmTransaction,} = require('@solana/web3.js');
const {getOrCreateAssociatedTokenAccount,createTransferInstruction,getMint,TOKEN_PROGRAM_ID,} = require('@solana/spl-token');
  
  const SOLANA_NETWORK = 'devnet'; // or 'mainnet-beta'
  const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
  
  const SENDER_PRIVATE_KEY = Uint8Array.from([
    71, 26, 91, 189, 149, 111, 170, 135, 146, 8, 254, 190, 192, 80, 178, 31, 75, 205, 45, 249, 43, 153, 11, 79, 43, 210,
    172, 100, 81, 132, 219, 205, 125, 147, 80, 116, 207, 229, 232, 53, 212, 253, 56, 210, 87, 68, 101, 252, 46, 195, 221,
    150, 73, 162, 72, 73, 215, 203, 208, 13, 63, 25, 21, 44,
  ]);
  const TOKEN_MINT_ADDRESS = '2oSVzbFfqRUW4166on8HNfQigLbCNNzY3xczVUgTJRdP'; 
  const RECIPIENT_PUBLIC_KEY = '9qZu5D4QTaBzVuPLihajhjaAFFU8DtHC2yW5WDEgEHiP';
  
  async function transferToken() {
    try {
      const senderWallet = Keypair.fromSecretKey(SENDER_PRIVATE_KEY);
  
      //token mint information
      const mintInfo = await getMint(connection, new PublicKey(TOKEN_MINT_ADDRESS));
      const decimals = 10 ** mintInfo.decimals;
  
      const amount = 0.005 * decimals; 
  
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet,
        new PublicKey(TOKEN_MINT_ADDRESS),
        senderWallet.publicKey
      );
  
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet,
        new PublicKey(TOKEN_MINT_ADDRESS),
        new PublicKey(RECIPIENT_PUBLIC_KEY)
      );
  
      const transaction = new Transaction().add(
        createTransferInstruction(
          senderTokenAccount.address,
          recipientTokenAccount.address,
          senderWallet.publicKey,
          amount,
        //   [],
        //   TOKEN_PROGRAM_ID
        )
      );
  
      const signature = await sendAndConfirmTransaction(connection, transaction, [senderWallet]);
  
      console.log('Transaction successful with signature:', signature);
    } catch (error) {
      if (error.logs) {
        console.error('Transaction failed:', error.logs);
      } else {
        console.error('Error transferring tokens:', error);
      }
    }
  }
  
  transferToken();
  