"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, ChevronRight, Menu, X, Moon, Sun, ArrowRight, Zap, Shield, BarChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { CustomLogo } from "@/components/custom-logo"


const CustomBackground = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Image 
          src={theme === "dark" ? "/assets/astras.png" : "/assets/c9.png"}
          alt="Background" 
          fill 
          className="object-cover opacity-100"
        />
      </div>
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Real-Time Prices",
      description: "Get up-to-the-minute cryptocurrency prices from major exchanges around the world.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Currency Conversion",
      description: "Easily convert between different cryptocurrencies and fiat currencies with accurate rates.",
      icon: <ArrowRight className="size-5" />,
    },
    {
      title: "Portfolio Tracking",
      description: "Monitor your cryptocurrency holdings across multiple wallets in one convenient dashboard.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Market Analysis",
      description: "Access detailed charts and analytics to make informed investment decisions.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Secure Storage",
      description: "Keep your portfolio information safe with end-to-end encryption and secure authentication.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Mobile Access",
      description: "Check your portfolio and convert currencies on the go with our mobile-friendly platform.",
      icon: <Zap className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CustomLogo
              text="ChainSwitch"
              letter="C"
              bgColor="bg-gradient-to-br from-cyan-400 to-cyan-300 dark:from-red-400 to-red-300"
            />
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#price-conversion"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Price Conversion
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link
                href="#price-conversion"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Price Conversion
              </Link>
              <Link href="#about" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        <CustomBackground>
          <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
            <div className="container px-4 md:px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Making Crypto Tracking Simple with ChainSwitch
                </h1>
                <p className="text-lg md:text-xl text-black dark:text-white mb-8 max-w-2xl mx-auto">
                  Track cryptocurrency prices, convert between coins and fiat currencies, and manage your portfolio all
                  in one place.
                </p>
                <div className="flex flex-col gap-4 mt-4 w-full max-w-md mx-auto">
                  <Input type="text" placeholder="Enter your wallet address" className="rounded-full h-12" />
                  <Button
                    size="lg"
                    className="rounded-full h-12 px-8 text-base bg-cyan-400 hover:bg-cyan-500 dark:bg-red-400 dark:hover:bg-red-500 text-black dark:text-white"
                  >
                    Start Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </CustomBackground>
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our comprehensive platform provides all the tools you need to streamline your workflow, boost
                productivity, and achieve your goals.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-cyan-200/10 dark:bg-red-400/20 flex items-center justify-center text-red-500 mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <CustomBackground>
          <section id="price-conversion" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Price Conversion
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Real-Time Crypto Conversion</h2>
                <p className="max-w-[800px] text-black dark:text-white md:text-lg">
                  Convert between cryptocurrencies and fiat currencies with real-time market rates.
                </p>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Currency Converter</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <Input type="number" placeholder="Amount" className="h-12" id="amount-input" />
                          </div>
                          <div>
                            <select
                              className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                              id="from-currency"
                            >
                              <option value="btc">BTC</option>
                              <option value="eth">ETH</option>
                              <option value="sol">SOL</option>
                              <option value="doge">DOGE</option>
                              <option value="ada">ADA</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="bg-muted rounded-full p-2">
                            <ArrowRight className="size-5" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder="Converted amount"
                              className="h-12"
                              id="result-input"
                              readOnly
                            />
                          </div>
                          <div>
                            <select
                              className="w-full h-12 rounded-md border border-input bg-background px-3 py-2"
                              id="to-currency"
                            > 
                              <option value="usd">USD</option>
                              <option value="eur">EUR</option>
                              <option value="gbp">GBP</option>
                              <option value="jpy">JPY</option>
                              <option value="cny">CNY</option>
                            </select>
                          </div>
                        </div>
                        <Button
                          className="w-full rounded-full h-12 dark:bg-red-400 dark:hover:bg-red-500 bg-cyan-400 hover:bg-cyan-500 text-black"
                          onClick={() => {
                            try {
                              const amountInput = document.getElementById("amount-input") as HTMLInputElement
                              const fromCurrencySelect = document.getElementById("from-currency") as HTMLSelectElement
                              const toCurrencySelect = document.getElementById("to-currency") as HTMLSelectElement
                              const resultInput = document.getElementById("result-input") as HTMLInputElement

                              const amount = Number.parseFloat(amountInput.value)
                              const fromCurrency = fromCurrencySelect.value
                              const toCurrency = toCurrencySelect.value

                              if (isNaN(amount)) {
                                alert("Please enter a valid number")
                                amountInput.focus()
                                return
                              }
                              const rates = {
                                btc: { usd: 61000, eur: 56000, gbp: 48000, jpy: 9200000, cny: 440000 },
                                eth: { usd: 2240, eur: 2050, gbp: 1760, jpy: 337000, cny: 16100 },
                                sol: { usd: 96, eur: 88, gbp: 75, jpy: 14400, cny: 690 },
                                doge: { usd: 0.086, eur: 0.079, gbp: 0.067, jpy: 12.9, cny: 0.62 },
                                ada: { usd: 0.45, eur: 0.41, gbp: 0.35, jpy: 67.5, cny: 3.24 },
                              }

                              if (toCurrency in rates) {
                                const usdValue = amount * rates[fromCurrency as keyof typeof rates].usd
                                const result = usdValue / rates[toCurrency as keyof typeof rates].usd
                                resultInput.value = result.toFixed(8)
                              } else {
                                const result =
                                  amount *
                                  rates[fromCurrency as keyof typeof rates][
                                    toCurrency as keyof (typeof rates)[keyof typeof rates]
                                  ]
                                resultInput.value = result.toFixed(2)
                              }
                            } catch (error) {
                              console.error("Conversion error:", error)
                              alert("An error occurred during conversion. Please try again.")
                            }
                          }}
                        >
                          Convert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Your Portfolio</h3>
                      <div className="space-y-4">
                        <div className="mb-4">
                          <Input
                            type="text"
                            placeholder="Enter wallet address to track"
                            className="h-12 mb-2"
                            id="wallet-address-input"
                          />
                          <Button
                            className="w-full rounded-full mb-4 dark:bg-red-400 hover:bg-dark-500 bg-cyan-400 hover:bg-white-500 text-black"
                            onClick={() => {
                              const walletInput = document.getElementById("wallet-address-input") as HTMLInputElement
                              const walletAddress = walletInput.value.trim()

                              if (!walletAddress) {
                                alert("Please enter a wallet address")
                                return
                              }

                              alert(`Wallet ${walletAddress} connected successfully!`)
                              walletInput.value = ""

                            }}
                          >
                            Track Wallet
                          </Button>
                        </div>

                        <div className="border-b border-border/40 pb-2 mb-2">
                          <h4 className="text-sm font-medium mb-1">Your Portfolio Value</h4>
                          <p className="text-2xl font-bold">$28,270.00</p>
                          <p className="text-xs text-green-500">+$1,240.50 (4.6%) today</p>
                        </div>

                        {[
                          {
                            coin: "Bitcoin",
                            symbol: "BTC",
                            amount: "0.25",
                            value: "$15,250",
                            change: "+2.3%",
                            stock: "15.3M BTC",
                          },
                          {
                            coin: "Ethereum",
                            symbol: "ETH",
                            amount: "3.5",
                            value: "$7,840",
                            change: "-0.8%",
                            stock: "120.4M ETH",
                          },
                          {
                            coin: "Solana",
                            symbol: "SOL",
                            amount: "45",
                            value: "$4,320",
                            change: "+5.7%",
                            stock: "562.1M SOL",
                          },
                          {
                            coin: "Dogecoin",
                            symbol: "DOGE",
                            amount: "10,000",
                            value: "$860",
                            change: "+1.2%",
                            stock: "140.5B DOGE",
                          },
                        ].map((coin, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full dark:bg-red-400/10 bg-cyan-400/10 flex items-center justify-center">
                                {coin.symbol.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{coin.coin}</p>
                                <div className="flex gap-2 items-center">
                                  <p className="text-xs text-muted-foreground">
                                    {coin.amount} {coin.symbol}
                                  </p>
                                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                    Stock: {coin.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{coin.value}</p>
                              <p
                                className={`text-xs ${coin.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                              >
                                {coin.change}
                              </p>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full rounded-full dark:bg-red-400 dark:hover:bg-red-500 bg-cyan-400 hover:bg-cyan-500 text-black ">
                          View All Assets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Market Trends</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="text-left p-3">Coin</th>
                            <th className="text-right p-3">Price</th>
                            <th className="text-right p-3">24h Change</th>
                            <th className="text-right p-3">Market Cap</th>
                            <th className="text-right p-3">Volume (24h)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              coin: "Bitcoin",
                              symbol: "BTC",
                              price: "$61,000",
                              change: "+2.3%",
                              marketCap: "$1.18T",
                              volume: "$28.5B",
                            },
                            {
                              coin: "Ethereum",
                              symbol: "ETH",
                              price: "$2,240",
                              change: "-0.8%",
                              marketCap: "$269.2B",
                              volume: "$12.7B",
                            },
                            {
                              coin: "Solana",
                              symbol: "SOL",
                              price: "$96",
                              change: "+5.7%",
                              marketCap: "$42.8B",
                              volume: "$3.2B",
                            },
                            {
                              coin: "Dogecoin",
                              symbol: "DOGE",
                              price: "$0.086",
                              change: "+1.2%",
                              marketCap: "$12.3B",
                              volume: "$980M",
                            },
                            {
                              coin: "Cardano",
                              symbol: "ADA",
                              price: "$0.45",
                              change: "-1.5%",
                              marketCap: "$15.9B",
                              volume: "$420M",
                            },
                          ].map((coin, i) => (
                            <tr key={i} className="border-b border-border/40 hover:bg-muted/30">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="size-6 rounded-full bg-yellow-400/10 flex items-center justify-center text-xs">
                                    {coin.symbol.charAt(0)}
                                  </div>
                                  <span className="font-medium">{coin.coin}</span>
                                  <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                                </div>
                              </td>
                              <td className="text-right p-3 font-medium">{coin.price}</td>
                              <td
                                className={`text-right p-3 ${coin.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                              >
                                {coin.change}
                              </td>
                              <td className="text-right p-3 text-muted-foreground">{coin.marketCap}</td>
                              <td className="text-right p-3 text-muted-foreground">{coin.volume}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </CustomBackground>

        <section id="about" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                About Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Mission</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                We're dedicated to making cryptocurrency accessible to everyone through simple, intuitive tools.
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000"
                    width={600}
                    height={400}
                    alt="Cryptocurrency visualization"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold">Simplifying Crypto for Everyone</h3>
                <p className="text-muted-foreground">
                  Founded in 2023, our platform was built with a simple goal: to make cryptocurrency accessible to
                  everyone, regardless of their technical background or investment experience.
                </p>
                <p className="text-muted-foreground">
                  We believe that the future of finance is decentralized, and we're committed to providing the tools and
                  resources needed to navigate this new landscape with confidence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 mt-1">
                      <Check className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Real-time Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Our platform provides up-to-the-minute pricing data from multiple exchanges.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 mt-1">
                      <Check className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Secure Portfolio Tracking</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor your investments across different wallets and exchanges in one place.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 mt-1">
                      <Check className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Educational Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Access guides and tutorials to help you understand the crypto ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <CustomBackground>
          <section id="faq" className="w-full py-20 md:py-32">
            <div className="container px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Find answers to common questions about our platform.
                </p>
              </motion.div>

              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "How do I get started with the platform?",
                      answer:
                        "Getting started is simple. Just enter your wallet address and click 'Start Now'. You'll be able to track your portfolio and use our conversion tools immediately.",
                    },
                    {
                      question: "Which cryptocurrencies do you support?",
                      answer:
                        "We support all major cryptocurrencies including Bitcoin, Ethereum, Solana, Cardano, Dogecoin, and many more. We're constantly adding support for new coins based on market demand.",
                    },
                    {
                      question: "How accurate is your price data?",
                      answer:
                        "Our price data is sourced from multiple major exchanges and updated in real-time. We aggregate this data to provide the most accurate market prices possible.",
                    },
                    {
                      question: "Is my wallet information secure?",
                      answer:
                        "Absolutely. We use read-only API connections to track your portfolio. We never store your private keys or have access to your funds. All data is encrypted both in transit and at rest.",
                    },
                    {
                      question: "Can I track multiple wallets?",
                      answer:
                        "Yes, you can add multiple wallet addresses to track all your holdings in one place. This gives you a comprehensive view of your entire crypto portfolio.",
                    },
                    {
                      question: "Do you offer mobile apps?",
                      answer:
                        "Yes, we have mobile apps available for both iOS and Android, allowing you to track your portfolio and convert currencies on the go.",
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </CustomBackground>

        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-cyan-900 to-cyan-900 dark:from-red-900 dark:to-red-900 text-white dark:text-black relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Track Your Crypto Portfolio?
              </h2>
              <div className="flex flex-col w-full max-w-md gap-4 mt-4">
                <div className="bg-white/20 p-6 rounded-xl border border-white/30 backdrop-blur-sm">
                  <p className="mb-4 text-black/80">Enter your wallet address to get started:</p>
                  <Input
                    type="text"
                    placeholder="Enter your wallet address"
                    className="rounded-full h-12 bg-white/30 border-white/20 text-black placeholder:text-black/60 mb-4"
                  />
                  <Button
                    size="lg"
                    className="w-full rounded-full h-12 px-8 text-base bg-black hover:bg-black/80 text-white"
                  >
                    Start Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-4">
            <CustomLogo
            text="ChainSwitch"
            letter="C"
            bgColor="bg-gradient-to-br from-red-400 to-red-300"
            />
              <p className="text-sm text-muted-foreground">
                Track cryptocurrency prices, convert between coins and fiat currencies, and manage your portfolio all in
                one place.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#price-conversion"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Price Conversion
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ChainSwitch. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

