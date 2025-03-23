import React, { useState } from 'react';
import { IContract } from '@/contracts/IContract';
import { stellarService } from '@/services/stellar.service';
import { walletService } from '@/services/wallet.service';

interface CreateProjectProps {
  adminWallet: string;
  recieverWallet: string;
  setHashId: (hash: string) => void;
}

export const CreateProject: React.FC<CreateProjectProps> = ({
  adminWallet,
  recieverWallet,
  setHashId
}) => {
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const contractClient = await stellarService.buildClient<IContract>(
        adminWallet
      );

      const xdr = (
        await contractClient.create_project({
          creator: adminWallet,
          deadline: 0,
          goal: 0,
          project_id: recieverWallet,
        })
      ).toXDR();

      const signedTx = await walletService.signTransaction(xdr);

      const hashId = await stellarService.submitTransaction(signedTx.signedTxXDR);

      setHashId(hashId);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <form onSubmit={handleCreateClient} className="space-y-4">
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Crear Proyecto
      </button>
    </form>
  );
}; 