import { Bitcoin, EclipseIcon as Ethereum } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";

interface Account {
  id: string
  name: string
  symbol: string
  balance: number
  value: number
}

interface AccountsPanelProps {
  data: {
    totalBalance: {
      btc: number
      eth: number
      btcPrice: number
      ethPrice: number
    }
    accounts: Account[]
  }
}

export default function AccountsPanel({ data }: AccountsPanelProps) {
  const totalValueUSD = data.accounts.reduce((sum, account) => sum + account.value, 0)

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Total Balance (USD)</p>
            <p className="text-4xl font-bold text-white">${totalValueUSD.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Your Crypto</p>
            <div className="space-y-3">
              {data.accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {account.symbol === "BTC" ? (
                        <Bitcoin className="w-6 h-6 text-orange-500" />
                      ) : (
                        <Ethereum className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{account.name}</p>
                      <p className="text-sm text-gray-400">
                        {account.balance} {account.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${account.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">
                      ${account.symbol === "BTC" ? data.totalBalance.btcPrice : data.totalBalance.ethPrice}/
                      {account.symbol}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

