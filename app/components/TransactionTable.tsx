import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  timestamp: string
}

interface TransactionTableProps {
  data: Transaction[]
}

export default function TransactionTable({ data }: TransactionTableProps) {
  return (
    <div className="w-full max-w-4xl overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.from}</TableCell>
              <TableCell>{transaction.to}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

