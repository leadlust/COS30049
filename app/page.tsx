"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SearchBar from "./components/SearchBar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 + i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-gray-400 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

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
<<<<<<< Updated upstream
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-homepage">
      <div className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
=======
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={-2} />
        <FloatingPaths position={-2} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-black dark:text-white leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
>>>>>>> Stashed changes
          Blockchain Transaction
          <br />
          Visualization with ChainSwitch
        </motion.h1>
        <p className="text-xl text-black/60 dark:text-white/50 max-w-2xl">
          Experience a secured, fast search into your own wallet by entering a wallet address to view its transactions and connections.
        </p>
        <AnimatePresence mode="wait">
          {!showSearch ? (
            <motion.button
              key="explore-button"
              onClick={handleStartExploring}
              className="mt-4 bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition duration-300 text-lg"
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
  )
}
