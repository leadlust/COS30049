"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface SearchBarProps {
  onSearch: (address: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [address, setAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(address)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center space-x-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-white text-black"
      />
      <Button type="submit" className="bg-white text-black hover:bg-gray-200">
        Search
      </Button>
    </motion.form>
  )
}

