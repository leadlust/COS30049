import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";

interface WalletInfoProps {
  data: {
    address: string
    balance: {
      btc: number
      eth: number
    }
  }
}

export default function WalletInfo({ data }: WalletInfoProps) {
  return (
    <Card className="w-full max-w-4xl mb-8">
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Address:</strong> {data.address}
        </p>
        <p>
          <strong>BTC Balance:</strong> {data.balance.btc.toFixed(8)} BTC
        </p>
        <p>
          <strong>ETH Balance:</strong> {data.balance.eth.toFixed(8)} ETH
        </p>
      </CardContent>
    </Card>
  )
}

