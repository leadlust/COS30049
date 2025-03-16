import { useState } from "react";
import { Clock, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionTableData } from "@/types/api";
import { useRouter } from "next/navigation";
interface TransactionTableProps {
  transactions: TransactionTableData[];
  isLoading: boolean;
}

export function TransactionTable({
  transactions,
  isLoading,
}: TransactionTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  // Helper function to truncate addresses and hashes
  const truncateString = (
    str: string,
    startLength: number = 6,
    endLength: number = 4
  ) => {
    if (str.length <= startLength + endLength) return str;
    return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
  };

  // Helper function for transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    return type === "incoming" ? (
      <ArrowDownLeft className="h-3 w-3 text-green-500" />
    ) : (
      <ArrowUpRight className="h-3 w-3 text-red-500" />
    );
  };
  // Handler for hash click - opens Etherscan
  const handleHashClick = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
  };

  // Handler for address click - navigates to dashboard
  const handleAddressClick = (address: string) => {
    router.push(`/dashboard/${address}`);
  };
  if (isLoading) {
    return (
      <Card className="glass-panel animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-700/50 rounded w-36"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-white">
          <Clock className="mr-2 h-4 w-4 text-purple-500" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-800 rounded-lg">
          <table className="w-full">
            <thead className="bg-black text-gray-400">
              <tr className="text-left text-xs">
                <th className="p-2">Type</th>
                <th className="p-2">Hash</th>
                <th className="p-2">Time</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Gas Cost</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {currentTransactions.map((tx) => (
                <tr key={tx.hash} className="border-t border-gray-800">
                  <td className="p-2">
                    <div className="flex items-center">
                      {getTransactionTypeIcon(tx.type)}
                      <span className="ml-1 text-white">{tx.type}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 font-mono text-white hover:text-purple-400"
                      onClick={() => handleHashClick(tx.hash)}
                    >
                      <span className="truncate">
                        {truncateString(tx.hash)}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </td>
                  <td className="p-2 text-gray-400 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 font-mono text-gray-400 hover:text-purple-400"
                      onClick={() => handleAddressClick(tx.from)}
                    >
                      {truncateString(tx.from)}
                    </Button>
                  </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 font-mono text-gray-400 hover:text-purple-400"
                        onClick={() => handleAddressClick(tx.to)}
                      >
                        {truncateString(tx.to)}
                      </Button>
                    </td>
                  <td className="p-2 text-white whitespace-nowrap">
                    {tx.amount}
                  </td>

                  <td className="p-2 text-gray-400 whitespace-nowrap">
                    {tx.gasUsed}
                  </td>
                  <td className="p-2">
                    <span
                      className={`capitalize ${
                        tx.status === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
