
// importfunctionalities
import React from 'react';
import './App.css';
import {
  Keypair,
} from "@solana/web3.js";
import {useEffect , useState } from "react";

import {
  establishNewWallet,
  getWalletBalance,
  airdropSolWallet,
  sendSol,
} from './generic';

import {
  PhantomProvider,
  getProvider,
  connectPhantomWallet,
  disconnectPhantomWallet,
} from './phantom';

function App() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(undefined);

	// create state variable for the Phantom wallet key
  const [phantomwalletKey, setPhantomWalletKey] = useState<Keypair | undefined>(undefined);

	// create state variable for the Phantom wallet balance
  const [phantomwalletBalance, setPhantomWalletBalance] = useState<number | 0>(0);

  // create state variable for the new wallet key
  const [newwalletKey, setNewWalletKey] = useState<Keypair | undefined>(undefined);

  // create state variable for the new wallet balance
  const [newwalletBalance, setNewWalletBalance] = useState<number | 0>(0);

  // this is the function that runs whenever the component updates (e.g. render, refresh)
  useEffect(() => {
	  const provider = getProvider();

		// if the phantom provider exists, set this as the provider
	  if (provider) setProvider(provider);
	  else setProvider(undefined);
  }, []);

  /**
   * @description prompts user to connect to phantom wallet if it exists.
	 * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    const phantomKey = await connectPhantomWallet();
    // update walletKey from phantom provider
    setPhantomWalletKey(phantomKey);
    const balance = await getWalletBalance(phantomKey!.publicKey);
    setPhantomWalletBalance(balance);
  };

  /**
   * @description prompts user to create wallet and airdrops 2 SOL.
	 * This function is called when the Create wallet button is clicked
   */
  const createRandomWallet = async () => {
    const newWallet = await establishNewWallet();
    setNewWalletKey(newWallet);  
    await airdropSolWallet(newWallet.publicKey, 2); 
    const balance = await getWalletBalance(newWallet.publicKey);
    setNewWalletBalance(balance);
  };

  /**
   * @description prompts user to sends 2 SOL from the new wallet
   * This function is called when the Add 2 Sol button was clicked
   */
   const addSolToNewWallet = async () => {   
    await airdropSolWallet(newwalletKey?.publicKey! , 2); 
    const balance = await getWalletBalance(newwalletKey?.publicKey!);
    setNewWalletBalance(balance);
  };

  /**
   * @description disconnects to connected phantom wallet
   * This function is called when the Disconnect button was clicked
   */
  const disconnectWallet = async () => {
    if (phantomwalletKey) {
      await disconnectPhantomWallet();
      setPhantomWalletKey(undefined); // clear the phantom wallet key
    }
  };


  /**
   * @description Transfer 2 sol from generated wallet to phantom wallet
   * This function is called when the Transfer 2 Sol button was clicked
   */
  const txSolFromNewWalletToPhantomWallet = async () => {
    if (newwalletKey && phantomwalletKey) {
      await sendSol(newwalletKey, phantomwalletKey, 2);
      let balance = await getWalletBalance(newwalletKey?.publicKey!);
      setNewWalletBalance(balance);
      balance = await getWalletBalance(phantomwalletKey?.publicKey!);
      setPhantomWalletBalance(balance);
    }
  };

	// HTML code for the app
  return (
    <div className="App">
      <header className="App-header">
        {!newwalletKey && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={createRandomWallet}
          >
            Generate Wallet
          </button>
        )}
        {newwalletKey && (
          <p><button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={addSolToNewWallet}
          >
          Add 2 Sol
          </button>
          <br></br>
          {newwalletKey?.publicKey?.toBase58().toString()}
          <br></br>           
          Balance: {newwalletBalance} Sol
          </p>
        )}

        {newwalletKey && phantomwalletKey && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={txSolFromNewWalletToPhantomWallet}
          >
          Transfer 2 Sol
          </button>
        )}

        {provider && !phantomwalletKey && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={connectWallet}
          >
            Connect to Phantom
          </button>
        )}
        {provider && phantomwalletKey && (
          <p>
          <button
          style={{
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onClick={disconnectWallet}>Disconnect Phantom</button>
          <br></br>
          {phantomwalletKey?.publicKey?.toString()}
          <br></br> 
          Balance: {phantomwalletBalance} Sol
          </p>
        )}

        {!provider && (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}
      </header>
    </div>


  );
}

export default App;
