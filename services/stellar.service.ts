export class StellarService {
  buildClient<T>(creator: string) {
    throw new Error('Method not implemented.');
  }
  submitTransaction(signedTxXdr: string) {
    throw new Error('Method not implemented.');
  }
  private readonly serverUrl: string;

  constructor() {
    this.serverUrl = "https://horizon-testnet.stellar.org";
  }

  async getBalance(address: string): Promise<string> {
    try {
      const response = await fetch(`${this.serverUrl}/accounts/${address}`);
      const data = await response.json();
      const xlmBalance = data.balances.find(
        (b: any) => b.asset_type === "native"
      );
      return xlmBalance ? xlmBalance.balance : "0";
    } catch (error) {
      console.error("Error loading balance:", error);
      return "0";
    }
  }

  async loadAccount(address: string): Promise<any> {
    try {
      const response = await fetch(`${this.serverUrl}/accounts/${address}`);
      return await response.json();
    } catch (error) {
      console.error("Error loading account:", error);
      throw error;
    }
  }
}

export const stellarService = new StellarService(); 