"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  ChevronRight,
  Home,
  BarChart3,
  MessageSquare,
  Building,
  MoreHorizontal,
  Eye,
  EyeOff,
  User,
  Sparkles,
  Equal,
} from "lucide-react"
import Image from "next/image"

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
      style={{
        backgroundImage: isDarkMode
          ? "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url(/placeholder.svg?height=1200&width=1200)"
          : "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7)), url(/placeholder.svg?height=1200&width=1200)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl overflow-hidden border ${isDarkMode ? "border-gray-800" : "border-gray-200"} shadow-2xl`}
        >
          {/* Top Navigation Bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`p-4 flex justify-between items-center ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
          >
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="p-2">
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>

              <div className="flex gap-1">
                <motion.div
                  whileHover={{ y: -3 }}
                  className={`p-2 rounded-full ${isDarkMode ? "bg-yellow-500" : "bg-yellow-400"}`}
                >
                  <Home className="w-5 h-5 text-black" />
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="p-2 rounded-full bg-gray-800">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="p-2 rounded-full bg-gray-800">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="p-2 rounded-full bg-gray-800">
                  <Building className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <div className="w-10 h-5 rounded-full bg-gray-800 flex items-center p-0.5">
                  <motion.div
                    animate={{ x: isDarkMode ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-4 h-4 rounded-full bg-white cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium">Premium Member</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
                <Bell className="w-5 h-5 text-gray-400" />
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
                <div className="w-5 h-5 bg-gray-700 rounded-sm" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden"
              >
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${isDarkMode ? "bg-black" : "bg-white"}`}>
            {/* Left Column */}
            <motion.div
              variants={container}
              initial="hidden"
              animate={isLoaded ? "show" : "hidden"}
              className="space-y-4"
            >
              {/* Accounts Section */}
              <motion.div variants={item} className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Accounts</h2>
                <div className="flex items-center gap-2 bg-gray-900 rounded-full p-1 pl-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-teal-500 z-10"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  </div>
                  <span className="text-sm">All Banks</span>
                  <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-xs">+</span>
                  </div>
                </div>
              </motion.div>

              {/* Balance Card */}
              <motion.div
                variants={item}
                className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} relative overflow-hidden`}
              >
                <div className="flex justify-between">
                  <div>
                    <motion.h3 className="text-4xl font-bold" animate={{ opacity: isHidden ? 0.3 : 1 }}>
                      {isHidden ? "••••••••" : "$34,280.56"}
                    </motion.h3>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>17:05 15 Nov 2024</span>
                      <div className="w-4 h-4 rounded-full bg-gray-800 ml-2 flex items-center justify-center">
                        <span className="text-[8px]">↻</span>
                      </div>
                    </div>
                  </div>
                  <motion.button whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-sm"></div>
                    <Sparkles className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-lg font-medium">Premium Account</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Remaining Limit: $1376.98</div>

                  <div className="mt-4 relative h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="absolute h-full bg-yellow-500"
                    ></motion.div>
                  </div>
                </div>

                <motion.button whileHover={{ y: -2 }} className="mt-6 flex items-center text-sm font-medium">
                  <span>Details</span>
                  <div className="w-4 h-4 rounded-full bg-yellow-500 ml-2 flex items-center justify-center">
                    <span className="text-[8px] text-black">→</span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Hide Button */}
              <motion.div variants={item} className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsHidden(!isHidden)}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <span>{isHidden ? "Show" : "Hide"}</span>
                  {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </motion.button>
              </motion.div>

              {/* Sim Whippered Card */}
              <motion.div
                variants={item}
                className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-900/70" : "bg-gray-100"} relative overflow-hidden`}
              >
                <div className="flex justify-center items-center h-24">
                  <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                  <motion.div
                    animate={{
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      duration: 20,
                      ease: "linear",
                    }}
                    className="relative mx-4"
                  >
                    <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-20 blur-sm"></div>
                    <Sparkles className="w-10 h-10 text-yellow-500 relative z-10" />
                  </motion.div>
                  <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">SIM Whippered</div>

                <div className="mt-4 flex items-center">
                  <div className="w-10 h-5 rounded-full bg-gray-800 flex items-center p-0.5 ml-auto">
                    <motion.div animate={{ x: 20 }} className="w-4 h-4 rounded-full bg-yellow-500" />
                  </div>
                </div>
              </motion.div>

              {/* Bank Account Card */}
              <motion.div variants={item} className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-900/90" : "bg-gray-100"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                    <div className="w-8 h-4 rounded-full bg-gray-800 flex items-center p-0.5">
                      <motion.div animate={{ x: 16 }} className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Bank Account</div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <motion.h4
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="text-xl font-bold"
                  >
                    $ 16,365.50
                  </motion.h4>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-[8px] text-black">$</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Gold Assets</div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <motion.h4
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-xl font-bold"
                  >
                    44.70 Oz
                  </motion.h4>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-yellow-500 rounded-full"></div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ delay: 1.4, duration: 1 }}
                      className="h-full bg-gray-600"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Profit Section */}
              <motion.div variants={item} className="mt-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Profit</h2>
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">11</span>
                  <h2 className="text-xl font-bold text-gray-600">Exchanges</h2>
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">3</span>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm">Weekly</span>
                    <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-[8px]">↓</span>
                    </div>
                  </div>

                  <Equal className="w-5 h-5 text-gray-500" />
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-sm">All Profits</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6, type: "spring" }}
                      className="text-3xl font-bold"
                    >
                      64.89%
                    </motion.h3>
                    <div className="w-5 h-5 rounded-full bg-yellow-500 ml-2 flex items-center justify-center">
                      <span className="text-[8px] text-black">↑</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Profit</div>
                    <div className="text-sm font-medium">$ 6,365.50</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Equity</div>
                    <div className="text-sm font-medium">$ 2,853.30</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Margin</div>
                    <div className="text-sm font-medium">$ 22,363</div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="mt-6 h-16 relative"
                >
                  <svg className="w-full h-full" viewBox="0 0 400 60">
                    <motion.path
                      d="M0,50 C50,30 100,60 150,40 C200,20 250,50 300,30 C350,10 400,40 400,20"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 2 }}
                    />
                    <motion.circle
                      cx="150"
                      cy="40"
                      r="4"
                      fill="#EAB308"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              variants={container}
              initial="hidden"
              animate={isLoaded ? "show" : "hidden"}
              className="space-y-4"
            >
              {/* Transaction Section */}
              <motion.div variants={item} className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Transaction</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Limit</span>
                  <div className="w-5 h-5 rounded-full bg-gray-800"></div>
                </div>
              </motion.div>

              {/* Transfer Gold Coin Card */}
              <motion.div
                variants={item}
                className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} relative overflow-hidden`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">Transfer</h3>
                    <h3 className="text-2xl font-bold">Gold Coin</h3>
                    <div className="text-sm text-gray-500 mt-1">Amount: Oz</div>
                  </div>
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-16 h-16 rounded-full bg-yellow-500/20"
                    ></motion.div>
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      width={64}
                      height={64}
                      alt="Gold coin"
                      className="absolute inset-0 object-contain"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium">Kilos</span>
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-5xl font-bold"
                    >
                      5
                    </motion.div>
                    <span className="text-2xl">.</span>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-5xl font-bold"
                    >
                      3
                    </motion.div>
                    <Equal className="w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-yellow-500 text-black font-medium py-3 rounded-lg"
                  >
                    Transfer Coin
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
                  >
                    <Sparkles className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>

                <div className="mt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1.5"
                  >
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-[8px] text-black">$</span>
                    </div>
                    <span className="text-sm">Market</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Suggested Locals */}
              <motion.div variants={item} className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-900/80" : "bg-gray-100"}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Suggested Locals</h3>
                  <span className="text-xs text-gray-500">9/20</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="mt-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt="User avatar"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Christina Breun</div>
                      <div className="text-xs text-gray-500">Marketing</div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-yellow-500 text-black font-medium text-sm px-4 py-1.5 rounded-lg"
                  >
                    Transfer
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Transaction History */}
              <motion.div variants={item} className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-900/80" : "bg-gray-100"}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Transaction History</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>View more</span>
                    <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-[8px]">→</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="mt-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                        <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-[8px] text-black">$</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">12.70 Oz</div>
                        <div className="text-xs text-gray-500 font-mono">0x9714...a1e67</div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                        <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-[8px] text-black">$</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">16.40 Oz</div>
                        <div className="text-xs text-gray-500 font-mono">0x4813...a1e5f</div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Settings and Add Buttons */}
              <motion.div variants={item} className="flex justify-center gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
                >
                  <Sparkles className="w-5 h-5 text-gray-500 mr-2" />
                  <span>Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg flex items-center justify-center"
                >
                  <span className="mr-1">+</span>
                  <span>Add</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

