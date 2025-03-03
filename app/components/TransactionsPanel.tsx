import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  to?: string
  from?: string
  amount: number
  type: string
  timestamp: string
}

interface TransactionsPanelProps {
  data: {
    count: number
    transactions: Transaction[]
  }
}

export default function TransactionsPanel({ data }: TransactionsPanelProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xs font-medium text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400">Recent Activity ({data.count} transactions)</p>
            <p className="text-[10px] text-gray-400">This Month</p>
          </div>

          <div className="space-y-3">
            {data.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                    {transaction.from ? (
                      <ArrowDownRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-white">
                      {transaction.from ? "Received" : "Sent"} {transaction.amount} {transaction.type}
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {transaction.from
                        ? `From: ${transaction.from.slice(0, 10)}...`
                        : `To: ${transaction.to?.slice(0, 10)}...`}
                    </p>
                    <p className="text-[9px] text-gray-400">{transaction.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white text-[10px]"
          >
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

