"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SearchBar from "./components/SearchBar"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()

  const handleStartExploring = () => {
    setShowSearch(true)
  }

  const handleSearch = (address: string) => {
    router.push(`/wallet/${address}`)
  }

  return (
  <div className="relative min-h-screen bg-[url('/assets/bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-homepage">
      <div className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Blockchain Transaction
          <br />
          Visualization with ChainSwitch
        </h1>
        <p className="text-xl text-white/50 max-w-2xl">
          Experience a secured, fast search into your own wallet by entering a wallet address to view its transactions and connections.
        </p>
        <AnimatePresence mode="wait">
          {!showSearch ? (
            <motion.button
              key="explore-button"
              onClick={handleStartExploring}
              className="mt-4 bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition duration-300 text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              Get Started
            </motion.button>
          ) : (
            <motion.div
              key="search-bar"
              className="mt-4 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div> 
  )
}
