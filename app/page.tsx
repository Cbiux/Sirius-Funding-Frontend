"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "./components/Header"
import { walletKit } from "./wallets/walletsKit"
import { stellarService } from "@/services/stellar.service"
import { ChevronRight, ExternalLink, X, Wallet, Star, Lightbulb, Users, Award, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CreateProject } from './components/CreateProject'

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
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background with stars */}
      <div className="animated-background fixed inset-0 z-0" />

      {/* Floating particles */}
      <div className="particles-container fixed inset-0 z-0" />

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <Badge className="mb-6 px-4 py-1.5 bg-primary/20 text-primary border-primary/30">Stellar Ecosystem</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
            Sirius Funding
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your Dedicated Funding Platform on Stellar, Empowering Projects to Reach New Heights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group"
              onClick={() => window.location.href = '/projects'}
            >
              Explore Funding Opportunities
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
              Learn More
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Floating elements */}
        <div
          className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl opacity-40"
          style={{ transform: `translate(20%, 30%) scale(${1 + scrollY * 0.001})` }}
        />
        <div
          className="absolute top-1/4 left-0 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-40"
          style={{ transform: `translate(-30%, -20%) scale(${1 + scrollY * 0.0005})` }}
        />
      </section>

      {/* The Problem Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <Badge className="mb-4 px-3 py-1 bg-red-500/20 text-red-400 border-red-500/30">The Problem</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Funding Challenges in the Stellar Ecosystem</h2>
              <p className="text-white/70 mb-6">
                Stellar projects lack a dedicated platform to aggregate and distribute funding opportunities, creating
                barriers to innovation and growth within the ecosystem.
              </p>
              <div className="space-y-4">
                {[
                  "Fragmented funding sources",
                  "Limited visibility for promising projects",
                  "Complex application processes",
                  "Lack of transparency in fund allocation",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                    </div>
                    <p className="text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-primary/20 rounded-3xl blur-xl opacity-70" />
              <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="h-2 w-24 bg-red-500/40 rounded-full" />
                    <div className="h-2 w-32 bg-white/20 rounded-full" />
                    <div className="h-2 w-40 bg-white/10 rounded-full" />
                    <div className="h-2 w-28 bg-white/20 rounded-full" />
                    <div className="h-2 w-36 bg-white/10 rounded-full" />
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-white/5 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="h-4 w-4 rounded-full bg-red-400/40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30"
          style={{ transform: `translate(30%, -30%) scale(${1 + scrollY * 0.0008})` }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-green-500/20 text-green-400 border-green-500/30">The Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Empowering the Stellar Ecosystem</h2>
            <p className="text-white/70">
              Sirius Funding bridges the gap between innovative projects and funding sources, unlocking potential and
              driving ecosystem growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lightbulb className="h-8 w-8 text-purple-400" />,
                title: "Innovation",
                description: "Accelerate development of groundbreaking solutions on Stellar",
              },
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Growth",
                description: "Expand the Stellar ecosystem through strategic resource allocation",
              },
              {
                icon: <Users className="h-8 w-8 text-purple-400" />,
                title: "Community",
                description: "Foster collaboration between developers, investors, and users",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-12 w-12 rounded-xl bg-black/30 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Customers Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black/0 via-primary/5 to-black/0">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-blue-500/20 text-blue-400 border-blue-500/30">Our Customers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who Benefits from Sirius Funding?</h2>
            <p className="text-white/70">
              Our platform serves a diverse range of stakeholders in the Stellar ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="h-10 w-10 text-blue-400" />,
                title: "Companies",
                description:
                  "Established businesses building solutions on Stellar seeking funding for expansion or new product development",
              },
              {
                icon: <Lightbulb className="h-10 w-10 text-yellow-400" />,
                title: "Entrepreneurs",
                description:
                  "Visionaries with innovative ideas looking to bring new solutions to the Stellar ecosystem",
              },
              {
                icon: <Users className="h-10 w-10 text-purple-400" />,
                title: "Developers",
                description: "Technical innovators working on Stellar infrastructure, tools, and applications",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
                <Card className="border-white/10 bg-black/40 backdrop-blur-sm h-full relative z-10 overflow-hidden rounded-2xl group-hover:border-primary/30 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8">
                    <div className="mb-6 rounded-2xl bg-white/5 w-20 h-20 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Value Proposition Section */}
      <section className="relative py-24 px-4">
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20"
          style={{ transform: `translate(-30%, 30%) scale(${1 + scrollY * 0.0008})` }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                Value Proposition
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Sirius Funding?</h2>
              <p className="text-white/70 mb-8">
                Our platform offers unique advantages that set us apart from traditional funding methods
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Visibility",
                    description: "Greater exposure to potential funders and investors",
                  },
                  {
                    title: "Access",
                    description: "Centralized hub for diverse funding sources and opportunities",
                  },
                  {
                    title: "Ease",
                    description: "Transparent and streamlined application processes",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-3xl blur-xl opacity-70" />
              <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-y divide-white/10">
                    {[
                      { value: "200+", label: "Projects Funded" },
                      { value: "$15M+", label: "Total Funding" },
                      { value: "45+", label: "Funding Sources" },
                      { value: "92%", label: "Success Rate" },
                    ].map((stat, i) => (
                      <div key={i} className="p-8 text-center">
                        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-white/70 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comprehensive Solution Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black/0 via-primary/5 to-black/0">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-primary/20 text-primary border-primary/30">Our Solution</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Funding Platform</h2>
            <p className="text-white/70">
              Sirius Funding offers a complete suite of tools and services to connect projects with funding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Grants Marketplace",
                description: "Browse and apply for grants from various sources in one place",
              },
              {
                title: "Direct Donations",
                description: "Enable community support through transparent donation channels",
              },
              {
                title: "On-Chain Records",
                description: "Transparent tracking of all funding activities on the Stellar blockchain",
              },
              {
                title: "AI-Powered Support",
                description: "Intelligent assistance for application preparation and optimization",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary">{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-30" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-4xl relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-1.5 bg-primary/20 text-primary border-primary/30">Get Started Today</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
            Start Funding Your Stellar Project
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join Sirius Funding and connect with the resources you need to bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group"
            >
              Join Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/50 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Sirius Funding
                </span>
              </div>
              <p className="text-white/70 text-sm">
                Empoderando proyectos innovadores en la red Stellar
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                {["About", "Projects", "Grants", "Resources"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-white/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                {["Documentation", "API", "Community", "Blog"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                {["Email", "Twitter", "Discord", "GitHub"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
            © 2025 Sirius Funding. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  )
}

