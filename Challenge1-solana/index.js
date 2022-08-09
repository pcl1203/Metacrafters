// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair, // Public key and a private key to send money(token) to and from to wallet
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Extract the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet(can use fake tokens)
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("Public Key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async (signature) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const myWallet = await Keypair.fromSecretKey(privateKey); // in Lamports
        const walletBalance = await connection.getBalance(
            new PublicKey(signature)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (signature) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(signature), // target wallet
            2 * LAMPORTS_PER_SOL // amount in lamports
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
  var address = process.argv[2];// try 9ddguLPpbxv5x2hbjbiJv2nG21ynGiRPH55rHNLpR2iy
  console.log("Target address", address);
  if (address != undefined){
    await getWalletBalance(address);
    await airDropSol(address);
    await getWalletBalance(address);
  }
}

mainFunction();
