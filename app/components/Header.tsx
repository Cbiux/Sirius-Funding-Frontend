"use client";

import { useState, useEffect } from "react";
import { Star, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectWallet, disconnectWallet } from "../wallets/walletsKit";
import { stellarService } from "@/services/stellar.service";
import Link from "next/link";
import { ProjectsModal } from "./ProjectsModal";

export function Header() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  useEffect(() => {
    const checkWalletConnection = () => {
      const address = localStorage.getItem("walletAddress");
      setWalletAddress(address);
      if (address) {
        loadBalance(address);
      }
    };

    checkWalletConnection();
    window.addEventListener("walletChanged", checkWalletConnection);
    window.addEventListener("walletDisconnected", checkWalletConnection);

    return () => {
      window.removeEventListener("walletChanged", checkWalletConnection);
      window.removeEventListener("walletDisconnected", checkWalletConnection);
    };
  }, []);

  const loadBalance = async (address: string) => {
    try {
      const balance = await stellarService.getBalance(address);
      setBalance(balance);
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Sirius Funding
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 mr-6">
              {["About", "Projects", "Grants", "Resources"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-white/80 hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <nav className="flex items-center space-x-4">
              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  className="text-white hover:text-primary hover:bg-white/5"
                >
                  Proyectos
                </Button>
              </Link>
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  Crear Proyecto
                </Button>
              </Link>
            </nav>

            {walletAddress ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-primary/50 text-primary group">
                  <Wallet className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                  <span className="ml-2 text-xs opacity-75">{balance} XLM</span>
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={handleDisconnect}
                  className="rounded-full h-9 w-9 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
      />
    </>
  );
} 