import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
} from "@creit.tech/stellar-wallets-kit";

interface WalletOption {
  id: string;
  name: string;
  icon?: string;
}

export interface WalletKitInterface {
  openModal(options: { onWalletSelected: (option: WalletOption) => Promise<void> }): Promise<void>;
  setWallet(walletId: string): void;
  getAddress(): Promise<{ address: string }>;
  disconnect(): Promise<void>;
}

export const walletKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: "freighter",
  modules: [
    new FreighterModule(),
  ],
});

export const connectWallet = async () => {
  try {
    await walletKit.openModal({
      onWalletSelected: async (option) => {
        await walletKit.setWallet(option.id);
        const { address } = await walletKit.getAddress();
        localStorage.setItem('walletAddress', address);
        window.dispatchEvent(new Event('walletChanged'));
      }
    });
    return true;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return false;
  }
};

export const disconnectWallet = async () => {
  try {
    await walletKit.disconnect();
    localStorage.removeItem('walletAddress');
    window.dispatchEvent(new Event('walletDisconnected'));
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
}; 