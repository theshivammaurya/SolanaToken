import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import { Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";


const secret = [71,26,91,189,149,111,170,135,146,8,254,190,192,80,178,31,75,205,45,249,43,153,11,79,43,210,172,100,81,132,219,205,125,147,80,116,207,229,232,53,212,253,56,210,87,68,101,252,46,195,221,150,73,162,72,73,215,203,208,13,63,25,21,44]; // 👈 Replace with your secret
const FROM_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(secret));
console.log(`My public key is: ${FROM_KEYPAIR.publicKey.toString()}.`);

const RPC = 'https://api.devnet.solana.com';
const CONNECTION = new Connection(RPC);

const destinationWallet = '9qZu5D4QTaBzVuPLihajhjaAFFU8DtHC2yW5WDEgEHiP';
const tokenAddress = '2oSVzbFfqRUW4166on8HNfQigLbCNNzY3xczVUgTJRdP';
const transferAmount = 1;

async function getNumberDecimals(mintAddress: string):Promise<number> {
    const info = await CONNECTION.getParsedAccountInfo(new PublicKey(tokenAddress));
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
}

async function sendTokens() {
    console.log(`Sending ${transferAmount} ${(tokenAddress)} from ${(FROM_KEYPAIR.publicKey.toString())} to ${(destinationWallet)}.`)
    //Step 1
    console.log(`1 - Getting Source Token Account`);
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
        CONNECTION, 
        FROM_KEYPAIR,
        new PublicKey(tokenAddress),
        FROM_KEYPAIR.publicKey
    );
    console.log(`    Source Account: ${sourceAccount.address.toString()}`);

        //Step 2
        console.log(`2 - Getting Destination Token Account`);
        let destinationAccount = await getOrCreateAssociatedTokenAccount(
            CONNECTION, 
            FROM_KEYPAIR,
            new PublicKey(tokenAddress),
            new PublicKey(destinationWallet)
        );
        console.log(`    Destination Account: ${destinationAccount.address.toString()}`);

         //Step 3
    console.log(`3 - Fetching Number of Decimals for Mint: ${tokenAddress}`);
    const numberDecimals = await getNumberDecimals(tokenAddress);
    console.log(`    Number of Decimals: ${numberDecimals}`);

        //Step 4
        console.log(`4 - Creating and Sending Transaction`);
        const tx = new Transaction();
        tx.add(createTransferInstruction(
            sourceAccount.address,
            destinationAccount.address,
            FROM_KEYPAIR.publicKey,
            transferAmount * Math.pow(10, numberDecimals)
        ))

        const latestBlockHash = await CONNECTION.getLatestBlockhash('confirmed');
        tx.recentBlockhash = await latestBlockHash.blockhash;    
        const signature = await sendAndConfirmTransaction(CONNECTION,tx,[FROM_KEYPAIR]);
        console.log(
            '\x1b[32m', //Green Text
            `   Transaction Success!🎉`,
            `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
}

sendTokens();