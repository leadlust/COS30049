import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Image from "next/image";

interface FinancialData {
  btcBalance: number
  ethBalance: number
  btcPrice: number
  ethPrice: number
  transactions: {
    date: string
    amount: number
    type: string
    action: string
  }[]
}

interface FinancialDashboardProps {
  data: FinancialData
}

export default function FinancialDashboard({ data }: FinancialDashboardProps) {
  const btcValue = data.btcBalance * data.btcPrice
  const ethValue = data.ethBalance * data.ethPrice
  const totalValue = btcValue + ethValue

  const chartData = [
    { name: "BTC", value: btcValue },
    { name: "ETH", value: ethValue },
  ]

  return (
    <div className="w-full max-w-4xl mb-8">
      <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>BTC Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.btcBalance.toFixed(8)} BTC</p>
            <p className="text-lg">${btcValue.toFixed(2)} USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ETH Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.ethBalance.toFixed(8)} ETH</p>
            <p className="text-lg">${ethValue.toFixed(2)} USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toFixed(2)} USD</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

