import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Search, Share2, Shield, Smartphone, Zap } from "lucide-react"

const features = [
  {
    title: "Real-time Transaction Tracking",
    description: "Monitor blockchain transactions as they happen with our advanced visualization system.",
    icon: BarChart3,
  },
  {
    title: "Wallet Analysis",
    description: "Users will have the ability to have a comprehensive look into wallet activities, balances, and transaction patterns.",
    icon: Search,
  },
  {
    title: "Network Visualization",
    description: "Users will be able to see all of the connections between wallets and track transaction flows with interactive graphs.",
    icon: Share2,
  },
  {
    title: "Security First",
    description: "Enterprise-grade security measures to protect your data and privacy.",
    icon: Shield,
  },
  {
    title: "Mobile Friendly",
    description: "Access your transaction data on any device with our responsive design.",
    icon: Smartphone,
  },
  {
    title: "Lightning Fast",
    description: "Powered by modern technology to access instant data retrieval and analysis.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <div className="w-full">
      <div className="w-full bg-gradient-to-r from-purple-800/70 to-blue-900/70 py-24 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Features</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover the powerful tools and capabilities that make ChainSwitch the leading platform for blockchain transaction visualization.
        </p>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors p-6 mx-4">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


