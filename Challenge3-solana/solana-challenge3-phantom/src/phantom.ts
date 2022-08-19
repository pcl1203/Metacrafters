import {
  PublicKey,
  Transaction,
  Keypair,
} from "@solana/web3.js";

// create types
type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

// create a provider interface (hint: think of this as an object) to store the Phantom Provider
export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

/**
 * @description gets Phantom provider, if it exists
 */
 export const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

  /**
   * @description prompts user to connect wallet if it exists.
   */
   export async function connectPhantomWallet(): Promise<Keypair | undefined> {
    // @ts-ignore
    const { solana } = window;

		// checks if phantom wallet exists
    if (solana) {
      try {
				// connects wallet and returns response which includes the wallet public key
        const response = await solana.connect();
        console.log('wallet account ', response.publicKey.toString());
				// update walletKey to be the public key
        return response;
      } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
      }
    }
    return undefined;
  };

  /**
   * @description disconnects to phantom wallet
   */
  export async function disconnectPhantomWallet() {
    // @ts-ignore
    const { solana } = window;
    if (solana && solana.isConnected) {
      console.log('Disconnects to phantom wallet account');
      await solana.disconnect();
    }
  };