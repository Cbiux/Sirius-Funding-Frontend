import { Server } from 'stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');

export const stellarService = {
  async loadAccount(address: string) {
    try {
      const account = await server.loadAccount(address);
      return account;
    } catch (error) {
      console.error('Error loading account:', error);
      throw new Error('Error loading account balance');
    }
  },

  async getBalance(address: string): Promise<string> {
    try {
      const account = await this.loadAccount(address);
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native');
      return xlmBalance ? xlmBalance.balance : '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  },

  async submitTransaction(signedXDR: string) {
    try {
      const response = await fetch('https://horizon-testnet.stellar.org/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `tx=${signedXDR}`,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error submitting transaction');
      }

      const result = await response.json();
      return result.hash;
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  }
}; 