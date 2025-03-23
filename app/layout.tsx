"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { walletKit } from "./wallets/walletsKit";
import { FiLogOut } from "react-icons/fi";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
      console.error("Error al conectar la wallet:", error);
      alert("Ocurrió un error al conectar la wallet.");
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await walletKit.disconnect();
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
    } catch (error) {
      console.error("Error al desconectar la wallet:", error);
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Barra superior fija */}
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-4 bg-purple-900 text-white shadow-lg">
            {/* Botón para volver */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
            >
              <span className="text-2xl font-bold">←</span>
              <span className="text-lg font-bold">Inicio</span>
            </button>

            {/* Botones de wallet */}
            <div className="flex gap-3">
              <button
                onClick={handleConnectWallet}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold transition-colors"
              >
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Conectar Wallet"}
              </button>
              {walletAddress && (
                <button
                  onClick={handleDisconnectWallet}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition-colors"
                >
                  <FiLogOut size={20} />
                  Desconectar
                </button>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="pt-20 min-h-screen bg-purple-900 text-white">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
