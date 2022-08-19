/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction, 
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

/**
 * Generate an account to pay for everything
 */
export async function establishNewWallet(): Promise<Keypair> {
  // Generate a keypair
  const createdWallet = Keypair.generate();
  console.log("Public Key of Payer is:", createdWallet.publicKey.toBase58());
  
  return createdWallet;
}

// Get the wallet balance from a given signature
export async function airdropSolWallet(publicKey:PublicKey, sol:number): Promise<void> {
  // Connect to the Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Requesting an airdrop of 2 Sol
    const sig = await connection.requestAirdrop(
      new PublicKey(publicKey),
      sol * LAMPORTS_PER_SOL,
    );
  
    await connection.confirmTransaction(sig);
}

// Get the wallet balance from a given signature
export async function getWalletBalance(publicKey:PublicKey): Promise<number> {
    // Connect to the Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Make a wallet (keypair) from privateKey and get its balance
    const walletBalance = await connection.getBalance(
        new PublicKey(publicKey)
    );
    let balance:number = walletBalance / LAMPORTS_PER_SOL;     
    return balance;
}

// Send sol from wallet to another wallet
export async function sendSol(fromKeypair:Keypair, toKeypair:Keypair, sol:number): Promise<void> {
  // Connect to the Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const senderKeypair = Keypair.fromSecretKey(fromKeypair.secretKey);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: sol * LAMPORTS_PER_SOL
    })
  );
  await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

}
