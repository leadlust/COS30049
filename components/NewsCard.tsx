import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface NewsCardProps {
  date: string
  source: string
  title: string
  description: string
  category: string
  impact: "High" | "Medium" | "Low"
  url: string
}

export default function NewsCard({ date, source, title, description, category, impact, url }: NewsCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/20 text-red-500"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500"
      case "Low":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex items-center text-xs text-gray-400">
          <span className="mr-2">{date}</span>|<span className="ml-2">{source}</span>
        </div>
        <h3 className="text-lg font-semibold text-white leading-tight">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-800 text-white">
            {category}
          </Badge>
          <Badge className={getImpactColor(impact)}>{impact} Impact</Badge>
        </div>
        <a
          href={url}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
          <ArrowRight className="w-4 h-4" />
        </a>
      </CardFooter>
    </Card>
  )
}

