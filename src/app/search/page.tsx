"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Header";

export interface Transaction {
  hash: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  timestamp: string;
  from: string;
  to: string;
  status: 'completed';
}

export interface WalletData {
  address: string;
  balance: number;
  transactions: {
    incoming: number;
    outgoing: number;
    firstTx: string;
    lastTx: string;
    history: Transaction[];
  };
}

export default function Page() {
  const [address, setAddress] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      setIsLoadingRecent(true);
      try {
        const response = await fetch('/api/search');
        if (response.ok) {
          const data = await response.json();
          setRecentSearches(data);
        }
      } catch (error) {
        console.error('Error fetching recent searches:', error);
      } finally {
        setIsLoadingRecent(false);
      }
    };
    fetchRecentSearches();
  }, [refreshCounter]);

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleRecentSearchClick = async (recentAddress: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAddress(recentAddress);
    setError(null);
    setWalletData(null);
  
    if (!isValidAddress(recentAddress)) {
      setError("Please enter a valid Ethereum address");
      return;
    }
  
    setIsValidating(true);
    try {
      const data = await fetchWalletData(recentAddress);
      setWalletData(data);
      setRefreshCounter(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch wallet data");
    } finally {
      setIsValidating(false);
    }
  };

  const fetchWalletData = async (address: string): Promise<WalletData> => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const result = await response.json();
      return {
        address,
        balance: result.balance,
        transactions: {
          incoming: result.incomingCount,
          outgoing: result.outgoingCount,
          firstTx: result.firstTransaction,
          lastTx: result.lastTransaction,
          history: result.transactions.map((tx: any) => ({
            hash: tx.hash,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'outgoing' : 'incoming',
            amount: tx.value / 1e18,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
            from: tx.from,
            to: tx.to,
            status: 'completed'
          }))
        }
      };
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      throw error;
    }
  };

  const handleSearch = async (e: FormEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    
    setError(null);
    setWalletData(null);
  
    if (!isValidAddress(address)) {
      setError("Please enter a valid Ethereum address");
      return;
    }
  
    setIsValidating(true);
    try {
      const data = await fetchWalletData(address);
      setWalletData(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("lastSearchedAddress", address);
      }
      setRefreshCounter(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch wallet data");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="text-center px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Wallet Transaction Visualizer</h1>
        <p className="text-gray-400 mb-6">Enter a wallet address above to visualize its transaction network</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
        {error && (
          <div className="bg-red-900/50 text-red-300 p-4 rounded-lg border border-red-800 mb-4">
            ⚠️ {error}
          </div>
        )}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="w-full max-w-xl"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-12 w-full"
              />
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 h-12 px-6 w-full sm:w-auto"
              disabled={isValidating}
            >
              {isValidating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Validating
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Search <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </motion.form>
      </div>

      {/* Simplified visualization placeholder */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent>
            {walletData ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-gray-300">Node visualization would go here</p>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-gray-400">Search an address to see network connections</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}