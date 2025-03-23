"use client";

import { useState, useEffect } from "react";
import { Star, Wallet, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectWallet, disconnectWallet } from "../wallets/walletsKit";
import { stellarService } from "@/services/stellar.service";
import Link from "next/link";
import { ProjectsModal } from "./ProjectsModal";
import { useTheme } from "@/components/theme-provider";

export function Header() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
    setWalletAddress(localStorage.getItem("walletAddress"));
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWalletAddress(null);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background dark:bg-background-dark border-b border-border dark:border-border-dark backdrop-blur-md">
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
                  className="text-sm text-text dark:text-text-dark hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <nav className="flex items-center space-x-4">
              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  className="text-text dark:text-text-dark hover:text-primary hover:bg-white/5"
                >
                  Projects
                </Button>
              </Link>
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  Create Project
                </Button>
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-text dark:text-text-dark"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

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