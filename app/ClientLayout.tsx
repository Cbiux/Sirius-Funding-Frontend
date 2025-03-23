"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { walletKit } from "./wallets/walletsKit";
import { FiLogOut } from "react-icons/fi";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      await walletKit.openModal({
        onWalletSelected: async (option) => {
          walletKit.setWallet(option.id);
          const { address } = await walletKit.getAddress();
          setWalletAddress(address);
          localStorage.setItem("walletAddress", address);
        },
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("An error occurred while connecting the wallet.");
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await walletKit.disconnect();
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-4 bg-background dark:bg-background-dark border-b border-border dark:border-border-dark shadow-lg">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-text dark:text-text-dark hover:text-primary transition-colors"
        >
          <span className="text-2xl font-bold">←</span>
          <span className="text-lg font-bold">Home</span>
        </button>

        {/* Wallet buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleConnectWallet}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-bold transition-colors"
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
          {walletAddress && (
            <button
              onClick={handleDisconnectWallet}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition-colors"
            >
              <FiLogOut size={20} />
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="pt-20 min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
        {children}
      </div>
    </>
  );
} 