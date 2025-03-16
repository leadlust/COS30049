import { Wallet, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletBalance } from "@/types/api";

interface WalletBalanceProps {
  balance: WalletBalance | null;
  isLoading: boolean;
  lastActive: string;
  totalOutgoing: number;
  totalIncoming: number;
}

export function WalletBalanceCards({
  balance,
  isLoading,
  lastActive,
  totalOutgoing,
  totalIncoming,
}: WalletBalanceProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-panel animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-700/50 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-700/50 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700/50 rounded w-32"></div>
              <div className="h-3 bg-gray-700/50 rounded w-24 mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!balance) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">
              Wallet Balance
            </CardTitle>
            <Coins className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {balance.balance.eth} ETH
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Last Active: {lastActive}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl flex items-center text-white font-extra-bold">
              <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              Wallet Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400">
                  Address
                </p>
                <p className="font-mono text-xs sm:text-sm mt-1 text-white break-all">
                  {balance.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl flex items-center text-white font-extra-bold">
              <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              Transactions Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs text-gray-300">Outgoing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-300">Imcoming</span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="text-xs sm:text-sm font-medium text-white">
                  {totalOutgoing}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white">
                  {totalIncoming}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
