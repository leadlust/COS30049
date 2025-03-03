"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import ForceGraph2D from "react-force-graph-2d"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GraphData {
  nodes: { id: string; label: string; x?: number; y?: number }[]
  links: { source: string; target: string; value: string }[]
}

interface TransactionGraphProps {
  data: GraphData
}

interface NodeDetails {
  id: string
  label: string
  transactions: {
    incoming: Array<{ from: string; value: string }>
    outgoing: Array<{ to: string; value: string }>
  }
}

export default function TransactionGraph({ data }: TransactionGraphProps) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [selectedNode, setSelectedNode] = useState<NodeDetails | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  const handleNodeClick = useCallback(
    (node: any) => {
      const transactions = {
        incoming: data.links
          .filter((link) => link.target.id === node.id)
          .map((link) => ({ from: link.source.id, value: link.value })),
        outgoing: data.links
          .filter((link) => link.source.id === node.id)
          .map((link) => ({ to: link.target.id, value: link.value })),
      }

      setSelectedNode({
        id: node.id,
        label: node.label,
        transactions,
      })
      setIsDialogOpen(true)
    },
    [data.links],
  )

  const handleNodeDrag = useCallback(
    (node) => {
      node.fx = Math.max(20, Math.min(dimensions.width - 20, node.x))
      node.fy = Math.max(20, Math.min(dimensions.height - 20, node.y))
    },
    [dimensions],
  )

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xs font-medium text-white">Transaction Network</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full relative" ref={containerRef}>
          {dimensions.width > 0 && dimensions.height > 0 ? (
            <ForceGraph2D
              graphData={data}
              backgroundColor="transparent"
              width={dimensions.width}
              height={dimensions.height}
              onNodeClick={handleNodeClick}
              onNodeDragEnd={handleNodeDrag}
              nodeRelSize={3}
              nodeColor="white"
              linkColor="rgba(255, 255, 255, 0.2)"
              linkDirectionalParticles={0}
              linkWidth={1}
              d3VelocityDecay={0.3}
              nodeCanvasObject={(node, ctx, globalScale) => {
                // Draw node circle
                ctx.beginPath()
                ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI)
                ctx.fillStyle = "#ffffff"
                ctx.fill()

                // Draw node label
                const label = node.label
                ctx.font = "6px Inter"
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.fillText(label, node.x, node.y + 8)
              }}
              linkCanvasObject={(link, ctx) => {
                const start = link.source
                const end = link.target

                // Draw link line
                ctx.beginPath()
                ctx.moveTo(start.x, start.y)
                ctx.lineTo(end.x, end.y)
                ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
                ctx.lineWidth = 1
                ctx.stroke()

                // Draw link value
                const midX = (start.x + end.x) / 2
                const midY = (start.y + end.y) / 2
                ctx.font = "6px Inter"
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(link.value, midX, midY - 4)

                // Draw arrow
                const angle = Math.atan2(end.y - start.y, end.x - start.x)
                const size = 3
                ctx.save()
                ctx.translate(end.x, end.y)
                ctx.rotate(angle)
                ctx.beginPath()
                ctx.moveTo(-size, -size / 2)
                ctx.lineTo(0, 0)
                ctx.lineTo(-size, size / 2)
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.restore()
              }}
              cooldownTicks={100}
              d3AlphaDecay={0.02}
              d3AlphaMin={0.001}
            />
          ) : (
            <div className="text-white text-xs">Loading graph...</div>
          )}
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedNode?.label} (ID: {selectedNode?.id})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedNode?.transactions.incoming.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Incoming Transactions:</h3>
                <ul className="space-y-2">
                  {selectedNode.transactions.incoming.map((tx, index) => (
                    <li key={index} className="text-xs">
                      From: {tx.from.slice(0, 10)}...
                      <br />
                      Amount: {tx.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedNode?.transactions.outgoing.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Outgoing Transactions:</h3>
                <ul className="space-y-2">
                  {selectedNode.transactions.outgoing.map((tx, index) => (
                    <li key={index} className="text-xs">
                      To: {tx.to.slice(0, 10)}...
                      <br />
                      Amount: {tx.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

