import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule,
  ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";
import { clear } from "console";

class WalletService {
  private kit: StellarWalletsKit;
  private connected: boolean = false;

  constructor() {
    this.kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new FreighterModule()]
    });
  }

  async connect(): Promise<string> {clear
    
    return new Promise(async (resolve) => {
      await this.kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          this.kit.setWallet(option.id);
          const { address } = await this.kit.getAddress();
          this.connected = true;
          resolve(address);
        },
      });
    });
  }

  async signTransaction(xdr: string) {
    try {
      const environment = {
        networkPassphrase: WalletNetwork.TESTNET
      };
      const signedTx = await this.kit.signTransaction(xdr, environment);
      return signedTx;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.kit.disconnect();
      this.connected = false;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const walletService = new WalletService();