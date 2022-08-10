// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
  [
    192, 162, 210, 244,  93, 181, 124,  56, 102, 140,  97,
    7, 247,  37, 159, 228, 177, 106, 200,  20,  80, 125,
    134, 142, 140,  21, 168, 213, 144,  99, 219, 166, 240,
    188,  17, 202, 108, 220, 196,  84, 163,  71,  48, 171,
    164, 131, 243, 248, 197, 162, 120, 189, 196,   1, 168,
    87, 244,  73,  31, 214, 146, 149,   5,   0
    ]            
);

const transferSol = async() => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

  // Other things to try: 
  // 1) Form array from userSecretKey
  // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
  // 2) Make a new Keypair (starts with 0 SOL)
  // const from = Keypair.generate();

  // Generate another Keypair (account we'll be sending to)
  const to = Keypair.generate();

  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(from.publicKey),
      2 * LAMPORTS_PER_SOL
  );

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature
  });
  console.log("Before Transaction");
  let fromBalance = await getWalletBalance(from.publicKey); 
  let toBalance = await getWalletBalance(to.publicKey);
  console.log(`Sender Wallet balance: ${fromBalance} SOL`);
  console.log(`Receiver Wallet balance: ${toBalance} SOL`);

  console.log("Airdrop completed for the Sender account");

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
      SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to.publicKey,
          lamports: (fromBalance / 2) * LAMPORTS_PER_SOL // Send half of FROM's wallet balance
      })
  );

  // Sign transaction
  var signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [from] // contains both private and public key
  );  
  console.log('Signature is ', signature);
  console.log("After Transaction");
  fromBalance =await getWalletBalance(from.publicKey); 
  toBalance = await getWalletBalance(to.publicKey);
  console.log(`Sender Wallet balance: ${fromBalance} SOL`);
  console.log(`Receiver Wallet balance: ${toBalance} SOL`);

}

const generateKeyPair = async() => {
  const newPair = Keypair.generate();
  console.log(newPair);
}

// Get the wallet balance from a given signature
const getWalletBalance = async (signature) => {
  try {
      // Connect to the Devnet
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      //console.log("Connection object is:", connection);

      // Make a wallet (keypair) from privateKey and get its balance
      const walletBalance = await connection.getBalance(
          new PublicKey(signature)
      );
      let balance = parseInt(walletBalance) / LAMPORTS_PER_SOL;
      
      return balance;
  } catch (err) {
      console.log(err);
      return 0;
  }
};

transferSol();
