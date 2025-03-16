import { Wallet, ArrowUpRight, ArrowDownLeft, Coins, Clock, ChartPie } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletData, Transaction } from '@/app/search/page';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VisualizeWalletButton from "./VisualizeWalletButton";

interface WalletDetailsProps {
  walletData: WalletData | null;
  isLoading: boolean;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ walletData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-8 px-4">
        <div className="glass-panel p-4 sm:p-6 animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-700/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!walletData) return null

  const { address, balance, transactions } = walletData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    return type === 'incoming' ? (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-8 px-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Wallet Balance</CardTitle>
            <Coins className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{balance} ETH</div>
            <p className="text-xs text-gray-400 mt-1">Last updated: {new Date().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Recent Outgoing</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{transactions?.outgoing || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Recent Incoming</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{transactions?.incoming || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl flex items-center text-white font-extra-bold">
              <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              Wallet Details
            </CardTitle>
            <VisualizeWalletButton walletAddress={address} />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400">Address</p>
                <p className="font-mono text-xs sm:text-sm mt-1 text-white break-all">{address}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400">First Transaction</p>
                <p className="text-xs sm:text-sm mt-1 text-white">{transactions?.firstTx || "No transactions found"}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400">Last Transaction</p>
                <p className="text-xs sm:text-sm mt-1 text-white">{transactions?.lastTx || "No transactions found"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Table */}
      <div className="mt-4">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center text-white font-extra-bold">
              <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto border border-gray-800 rounded-lg">
              <table className="w-full">
                <thead className="sticky top-0 bg-black text-gray-400">
                  <tr className="text-left text-xs font-medium text-gray-400">
                    <th className="p-3">Type</th>
                    <th className="p-3">Hash</th>
                    <th className="p-3">Amount (ETH)</th>
                    <th className="p-3 hidden sm:table-cell">From</th>
                    <th className="p-3 hidden sm:table-cell">To</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.history.map((tx: Transaction) => (
                    <tr key={tx.hash} className="border-t border-gray-800 text-xs sm:text-sm">
                      <td className="p-3">
                        <div className="flex items-center">
                          {getTransactionTypeIcon(tx.type)}
                          <span className="ml-2 text-white">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-white truncate w-[180px]">{tx.hash}</td>
                      <td className="p-3 text-white">{tx.amount}</td>
                      <td className="p-3 hidden sm:table-cell font-mono text-gray-400 truncate w-[150px]">{tx.from}</td>
                      <td className="p-3 hidden sm:table-cell font-mono text-gray-400 truncate w-[150px]">{tx.to}</td>
                      <td className="p-3 text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WalletDetails;