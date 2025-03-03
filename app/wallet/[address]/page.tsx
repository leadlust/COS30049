"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Manrope } from "next/font/google"
import AccountsPanel from "../../components/AccountsPanel"
import TransactionsPanel from "../../components/TransactionsPanel"
import TransactionGraph from "../../components/TransactionGraph"

const manrope = Manrope({ subsets: ["latin"] })

export default function WalletPage() {
  const params = useParams()
  const address = params.address as string

  const [accountsData, setAccountsData] = useState(null)
  const [transactionsData, setTransactionsData] = useState(null)
  const [graphData, setGraphData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const accounts = await fetchAccountsData(address)
      const transactions = await fetchTransactionsData(address)
      const graph = await fetchGraphData(address)

      setAccountsData(accounts)
      setTransactionsData(transactions)
      setGraphData(graph)
    }

    fetchData()
  }, [address])

  return (
    <div className={`w-full min-h-screen bg-black text-white ${manrope.className}`}>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Wallet Details</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{graphData && <TransactionGraph data={graphData} />}</div>
          <div className="space-y-6">
            {accountsData && <AccountsPanel data={accountsData} />}
            {transactionsData && <TransactionsPanel data={transactionsData} />}
          </div>
        </div>
      </main>
    </div>
  )
}

async function fetchAccountsData(address: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    totalBalance: {
      btc: 1.25,
      eth: 15.5,
      btcPrice: 35000,
      ethPrice: 2000,
    },
    accounts: [
      {
        id: "1",
        name: "Bitcoin",
        symbol: "BTC",
        balance: 1.25,
        value: 43750, // 1.25 * 35000
      },
      {
        id: "2",
        name: "Ethereum",
        symbol: "ETH",
        balance: 15.5,
        value: 31000, // 15.5 * 2000
      },
    ],
  }
}

async function fetchTransactionsData(address: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    count: 23,
    transactions: [
      {
        id: "1",
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        amount: 0.5,
        type: "BTC",
        timestamp: "Today, 2:45 PM",
      },
      {
        id: "2",
        from: "0x123d35Cc6634C0532925a3b844Bc454e4438f123",
        amount: 2.0,
        type: "ETH",
        timestamp: "Today, 9:00 AM",
      },
      {
        id: "3",
        to: "0x987d35Cc6634C0532925a3b844Bc454e4438f987",
        amount: 0.1,
        type: "BTC",
        timestamp: "Yesterday",
      },
    ],
  }
}

async function fetchGraphData(address: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    nodes: [
      { id: address, label: "Your Wallet" },
      { id: "0x742d...f44e", label: "Wallet 1" },
      { id: "0x123d...f123", label: "Wallet 2" },
      { id: "0x987d...f987", label: "Wallet 3" },
    ],
    links: [
      { source: address, target: "0x742d...f44e", value: "0.5 BTC" },
      { source: "0x123d...f123", target: address, value: "2.0 ETH" },
      { source: address, target: "0x987d...f987", value: "0.1 BTC" },
    ],
  }
}

