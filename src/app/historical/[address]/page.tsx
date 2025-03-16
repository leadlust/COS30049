"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Graph } from "@/components/dashboard/Graph";
import type { Node, GraphData, Link } from "@/types/graph";
import { TransactionTableData } from "@/types/api";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"
import { TransactionData } from "@/types/neo4j";

interface ExtendedNode extends Node {
  name: string;
  type?: string;
}

interface HistoricalDataResponse {
  data: {
    address: {
      address: string;
      type: string;
    };
    incomingTransactions: TransactionData[];
    outgoingTransactions: TransactionData[];
    totalTransactions: number;
  };
}

const Page = () => {
  const [address, setAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{address: string; type: string}>>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [centerNode, setCenterNode] = useState<Node | null>(null);
  const [tableData, setTableData] = useState<TransactionTableData[]>([]);
  const router = useRouter();
  const params = useParams();
  const currentAddress = params.address as string;

  // Fetch address suggestions from Neo4j
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/historical/suggestions?search=${searchTerm}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data.data && Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  const fetchHistoricalData = useCallback(async (walletAddress: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/historical/${walletAddress}/transactions`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API returned status ${response.status}`);
      }
      
      const data = await response.json() as HistoricalDataResponse;
      
      if (!data.data) {
        throw new Error("No historical data found for this address");
      }

      // Transform historical data to graph format
      const historicalData = data.data;
      const nodes: ExtendedNode[] = [
        {
          id: historicalData.address.address,
          name: historicalData.address.address,
          val: historicalData.totalTransactions,
          isCenter: true,
          type: historicalData.address.type
        }
      ];

      const links: Link[] = [];
      const addedNodes = new Set([historicalData.address.address]);

      // Process incoming transactions
      historicalData.incomingTransactions.forEach((tx: TransactionData) => {
        if (!addedNodes.has(tx.from_address)) {
          nodes.push({
            id: tx.from_address,
            name: tx.from_address,
            val: 1,
            isCenter: false
          });
          addedNodes.add(tx.from_address);
        }
        links.push({
          id: tx.hash,
          source: tx.from_address,
          target: historicalData.address.address,
          val: parseFloat(tx.value),
          hash: tx.hash,
          timestamp: tx.block_timestamp.toString()
        });
      });

      // Process outgoing transactions
      historicalData.outgoingTransactions.forEach((tx: TransactionData) => {
        if (!addedNodes.has(tx.to_address)) {
          nodes.push({
            id: tx.to_address,
            name: tx.to_address,
            val: 1,
            isCenter: false
          });
          addedNodes.add(tx.to_address);
        }
        links.push({
          id: tx.hash,
          source: historicalData.address.address,
          target: tx.to_address,
          val: parseFloat(tx.value),
          hash: tx.hash,
          timestamp: tx.block_timestamp.toString()
        });
      });

      // Transform transactions for table
      const tableTransactions: TransactionTableData[] = [
        ...historicalData.incomingTransactions.map((tx: TransactionData) => ({
          type: 'incoming' as const,
          hash: tx.hash,
          amount: `${tx.value} ETH`,
          from: tx.from_address,
          to: tx.to_address,
          timestamp: new Date(tx.block_timestamp * 1000).toISOString(),
          status: 'success' as const,
          gasUsed: `${tx.gas_used} ETH`
        })),
        ...historicalData.outgoingTransactions.map((tx: TransactionData) => ({
          type: 'outgoing' as const,
          hash: tx.hash,
          amount: `${tx.value} ETH`,
          from: tx.from_address,
          to: tx.to_address,
          timestamp: new Date(tx.block_timestamp * 1000).toISOString(),
          status: 'success' as const,
          gasUsed: `${tx.gas_used} ETH`
        }))
      ];

      setGraphData({ nodes, links });
      setCenterNode(nodes[0]);
      setTableData(tableTransactions);
      
    } catch (error: unknown) {
      console.error("Error fetching historical data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch historical data");
      setGraphData({ nodes: [], links: [] });
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress);
      fetchHistoricalData(currentAddress);
    }
  }, [currentAddress, fetchHistoricalData]);

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidAddress(address)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsValidating(true);
    
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastSearchedAddress", address);
      }
      router.push(`/historical/${address}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to navigate");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1625]">
      <div className="pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white mb-6">
            Historical Transaction Explorer
          </h1>
          
          <div className="mb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md">
                ⚠️ {error}
              </div>
            )}
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-black/20 border-gray-700 text-white h-12"
                    >
                      {address
                        ? address
                        : "Select an address..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search address..." 
                        onValueChange={(value) => {
                          setAddress(value);
                          fetchSuggestions(value);
                        }}
                      />
                      <CommandEmpty>No address found.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(suggestions) && suggestions.length > 0 ? (
                          suggestions.map((suggestion) => (
                            <CommandItem
                              key={suggestion.address}
                              value={suggestion.address}
                              onSelect={(currentValue) => {
                                setAddress(currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  address === suggestion.address ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{suggestion.address}</span>
                                <span className="text-sm text-gray-400">{suggestion.type}</span>
                              </div>
                            </CommandItem>
                          ))
                        ) : null}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
                disabled={isValidating || isLoading}
              >
                {isValidating || isLoading ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </Button>
            </form>
          </div>
          
          {currentAddress && (
            <div className="mb-4">
              <Card className="bg-gray-900/50 border-gray-800 text-white">
                <CardContent className="py-3 px-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Current Wallet</p>
                      <p className="font-mono text-sm break-all">{currentAddress}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-xs text-gray-300">Outgoing</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-xs text-gray-300">Incoming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-4 rounded-lg overflow-hidden bg-black min-h-[400px] h-[600px] max-h-[calc(100vh-200px)]">
            <Graph 
              graphData={graphData}
              isLoading={isLoading}
              centerNode={centerNode}
            />
          </div>
          
          <div className="mt-4">
            <TransactionTable    
              transactions={tableData}
              isLoading={isLoading}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Page;
