"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Graph } from "@/components/dashboard/Graph";
import type { Node, GraphData } from "@/types/graph";
import { TransactionTableData, WalletBalance } from "@/types/api";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { WalletBalanceCards } from "@/components/dashboard/WalletDetails";


interface DashboardContentProps {
  currentAddress?: string;
}
interface TypeCounts {
    incoming: number;
    outgoing: number;
  }
const DashboardContent = ({ currentAddress }: DashboardContentProps) => {
  const [address, setAddress] = useState<string>(currentAddress || "");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [centerNode, setCenterNode] = useState<Node | null>(null);
  const [tableData, setTableData] = useState<TransactionTableData[]>([]);
  const [balanceData, setBalance] = useState<WalletBalance | null>(null);
  const [walletLastActive, setWalletLastActive] = useState<string | null>(null);
  const [totalOutgoing, setTotalOutgoing] = useState<number>(0);
  const [totalIncoming, setTotalIncoming] = useState<number>(0);
  const router = useRouter();

  const fetchWalletData = useCallback(async (walletAddress: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [transactionResponse, balanceResponse] = await Promise.all([
        fetch(`/api/addresses/${walletAddress}/transactions`),
        fetch(`/api/addresses/${walletAddress}/balance`)
      ]);
      
      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        throw new Error(errorData.error || `API returned status ${transactionResponse.status}`);
      }
      if (!balanceResponse.ok) {
        const errorData = await balanceResponse.json();
        throw new Error(errorData.error || `API returned status ${balanceResponse.status}`);
      }
      
      // Parse both responses
      const [transactionData, balanceData] = await Promise.all([
        transactionResponse.json(),
        balanceResponse.json()
      ]);
      const {graphData, tableData} = transactionData;
      console.log(tableData[0]);
      const countByTypeWithFilter = (transactions: TransactionTableData[]): TypeCounts => {
        return {
          outgoing: transactions.filter(tx => tx.type === "outgoing").length,
          incoming: transactions.filter(tx => tx.type === "incoming").length
        };
      };
      const { outgoing, incoming } = countByTypeWithFilter(tableData);
      if (!graphData.nodes || !graphData.links || graphData.nodes.length === 0) {
        throw new Error("No transaction data found for this address");
      }
      const center = graphData.nodes.find((node: Node) => node.isCenter);
      const walletLastActive = tableData[0].timestamp;
      //Update State
      setGraphData(graphData);
      setCenterNode(center || null);
      setTableData(tableData);
      setBalance(balanceData);
      setWalletLastActive(walletLastActive);
      setTotalOutgoing(outgoing);
      setTotalIncoming(incoming);
    } catch (error: unknown) {
      console.error("Error fetching graph data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch transaction data");
      setGraphData({ nodes: [], links: [] });
      setTableData([]);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress);
      fetchWalletData(currentAddress);
    }
  }, [currentAddress, fetchWalletData]);

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
      router.push(`/dashboard/${address}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to navigate");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Enter wallet address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10 bg-black/20 border-gray-700 text-white placeholder:text-gray-400 h-12 w-full"
            />
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
      
      {currentAddress ? (
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
      ) : (
        <Card className="bg-gray-900/50 border-gray-800 text-white mb-4">
          <CardContent className="py-4 text-center">
            <p className="text-gray-400">
              Enter a wallet address above to visualize its transaction network
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Wallet Balance Cards */}
      <div className="flex justify-center">
        <WalletBalanceCards 
          balance={balanceData}
          isLoading={isLoading}
          lastActive={walletLastActive || ""}
          totalOutgoing={totalOutgoing}
          totalIncoming={totalIncoming}
        />
      </div>
      
      <div className="mt-4 rounded-lg overflow-hidden bg-black min-h-[400px] h-[600px] max-h-[calc(100vh-200px)]">
        <Graph 
          graphData={graphData}
          isLoading={isLoading}
          centerNode={centerNode}
        />
      </div>
      
      {/* Transaction Table with Pagination */}
      <div className="mt-4">
        <TransactionTable    
          transactions={tableData}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default DashboardContent;