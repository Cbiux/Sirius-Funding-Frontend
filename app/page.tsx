"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "./components/Header"
import { walletKit } from "./wallets/walletsKit"
import { stellarService } from "@/services/stellar.service"
import { ChevronRight, ExternalLink, X, Wallet, Star, Lightbulb, Users, Award, Package, ArrowRight, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CreateProject } from './components/CreateProject'
import Link from "next/link"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress")
    if (savedWallet) {
      setWalletAddress(savedWallet)
      loadBalance(savedWallet)
    }
  }, [])

  const loadBalance = async (address: string) => {
    try {
      const account = await stellarService.loadAccount(address)
      const xlmBalance = account.balances.find((b: any) => b.asset_type === "native")
      setBalance(xlmBalance ? xlmBalance.balance : "0")
    } catch (error) {
      console.error("Error al cargar el balance:", error)
      setBalance("0")
    }
  }

  const handleConnectWallet = async () => {
    try {
      await walletKit.openModal({
        onWalletSelected: async (option) => {
          walletKit.setWallet(option.id)
          const { address } = await walletKit.getAddress()
          setWalletAddress(address)
          localStorage.setItem("walletAddress", address)
          await loadBalance(address)
        },
      })
    } catch (error) {
      console.error("Error al conectar la wallet:", error)
      alert("Ocurrió un error al conectar la wallet.")
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await walletKit.disconnect()
      setWalletAddress(null)
      localStorage.removeItem("walletAddress")
    } catch (error) {
      console.error("Error al desconectar la wallet:", error)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const adminWallet = "GBXXX..."; // Reemplazar con la dirección de la billetera del administrador
  const recieverWallet = "GBYYY..."; // Reemplazar con la dirección de la billetera del receptor

  const handleHashId = (hash: string) => {
    console.log('Transaction hash:', hash);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Star className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent pb-2">
            Sirius Funding
          </h1>
          <p className="text-xl mb-8 text-text/80 dark:text-text-dark/80">
            Empowering innovative projects on the Stellar network
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Sección de información */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-primary transition-all duration-500">
                Fund Your Dreams on Stellar
              </h2>
              <p className="text-lg mb-6 text-text/80 dark:text-text-dark/80 group-hover:text-text dark:group-hover:text-text-dark transition-colors duration-300">
                Sirius Funding is your gateway to decentralized project funding on the Stellar network. 
                Create, fund, and grow your innovative projects with the power of blockchain technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Lightbulb className="h-6 w-6 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover/item:text-primary transition-colors duration-300">Innovative Projects</h3>
                    <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                      Launch your groundbreaking ideas and get funded by the community.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Users className="h-6 w-6 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover/item:text-primary transition-colors duration-300">Community Driven</h3>
                    <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                      Connect with supporters who believe in your vision.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Award className="h-6 w-6 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover/item:text-primary transition-colors duration-300">Transparent Funding</h3>
                    <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                      Track your funding progress and manage your project in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-2xl blur-3xl group-hover:from-primary/30 group-hover:to-purple-400/30 transition-all duration-500" />
              <Card className="relative bg-card/50 dark:bg-card-dark/50 backdrop-blur-sm border-border/50 dark:border-border-dark/50 group-hover:border-primary/30 dark:group-hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 group-hover:text-primary transition-colors duration-300">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Package className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold">How It Works</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 group/item">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                          <span className="text-primary font-semibold group-hover/item:scale-110 transition-transform duration-300">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 group-hover/item:text-primary transition-colors duration-300">Create Your Project</h4>
                          <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                            Set up your project details, funding goal, and timeline.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 group/item">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                          <span className="text-primary font-semibold group-hover/item:scale-110 transition-transform duration-300">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 group-hover/item:text-primary transition-colors duration-300">Share Your Vision</h4>
                          <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                            Present your project to the community and attract supporters.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 group/item">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                          <span className="text-primary font-semibold group-hover/item:scale-110 transition-transform duration-300">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 group-hover/item:text-primary transition-colors duration-300">Receive Funding</h4>
                          <p className="text-text/60 dark:text-text-dark/60 group-hover/item:text-text/80 dark:group-hover/item:text-text-dark/80 transition-colors duration-300">
                            Get funded in XLM and start building your project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark group hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Lightbulb className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">Decentralized Funding</h3>
            </div>
            <p className="text-text/60 dark:text-text-dark/60 group-hover:text-text/80 dark:group-hover:text-text-dark/80 transition-colors duration-300">
              Fund your projects directly through the Stellar network, with no intermediaries.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark group hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">Global Reach</h3>
            </div>
            <p className="text-text/60 dark:text-text-dark/60 group-hover:text-text/80 dark:group-hover:text-text-dark/80 transition-colors duration-300">
              Connect with supporters worldwide and raise funds in XLM.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark group hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Award className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">Transparent Process</h3>
            </div>
            <p className="text-text/60 dark:text-text-dark/60 group-hover:text-text/80 dark:group-hover:text-text-dark/80 transition-colors duration-300">
              Track your funding progress and manage your project in real-time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card dark:bg-card-dark border-t border-border dark:border-border-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Información de la empresa */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Sirius Funding</h3>
              </div>
              <p className="text-text/60 dark:text-text-dark/60">
                Empowering innovative projects on the Stellar network through decentralized funding solutions.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/projects" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Create Project
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Explore Projects
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-text/60 dark:text-text-dark/60 hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <a href="mailto:contact.sirius.funding@gmail.com" className="text-text/80 dark:text-text-dark/80 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    contact.sirius.funding@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-text/80 dark:text-text-dark/80 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Aleph, Argentina
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="https://github.com/sirius-funding" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Github className="w-5 h-5 text-primary" />
                </a>
                <a href="https://x.com/FundingSir27159" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/sirius-funding" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-border dark:border-border-dark my-8" />

          {/* Copyright */}
          <div className="text-center text-text/60 dark:text-text-dark/60">
            <p>&copy; {new Date().getFullYear()} Sirius Funding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

