"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraphData, Node, Link, ForceGraphNode, ForceGraphLink } from "@/types/graph";
// dynamically importing forcegraph2d to prevent SSR issues
const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d'),
  { ssr: false }
);
interface GraphProps {
  graphData: GraphData;
  isLoading: boolean;
  centerNode: Node | null;
}
const GRAPH_CONFIG = {
  NODE_SIZE: 3,
  CENTER_NODE_VALUE: 4,
  NORMAL_NODE_VALUE: 2,
  ZOOM_LEVEL: 2,
  ZOOM_DURATION: 1000,
  FONT_SIZE: 12,
  NODE_RADIUS: 6,
  LINK_WIDTH: 0.05,
  LINK_CURVATURE: 0.05,
} as const;

const COLORS = {
  SENDING: "rgba(255, 0, 0, 0.8)",
  RECEIVING: "rgba(0, 255, 0, 0.8)",
  DEFAULT: "rgba(204, 204, 204, 0.5)",
  NODE_FILL: "rgba(211,211,211, 0.3)",
  NODE_TEXT: "white",
  NODE_HIGHLIGHT: "rgba(176, 38, 255, 0.8)",
  BACKGROUND: "black",
} as const;

export const Graph = ({ graphData,isLoading, centerNode }: GraphProps) => {
  const router = useRouter();
  const fgRef = useRef<any>(null);
  const searchParams = useSearchParams();

  const getNodeId = useCallback((node: string | Node): string => {
    return typeof node === "object" && "id" in node ? node.id : node;
  }, []);

  const getLinkColor = useCallback(
    (link: Link): string => {
      const sourceId = getNodeId(link.source);
      const targetId = getNodeId(link.target);

      if (centerNode) {
        if (sourceId === centerNode.id) return COLORS.SENDING;
        if (targetId === centerNode.id) return COLORS.RECEIVING;
      }
      return COLORS.DEFAULT;
    },
    [centerNode, getNodeId]
  );

  const handleNodeClick = useCallback(
    (node: ForceGraphNode) => {
      router.push(`/dashboard/${node.id}`);
      if (typeof window !== "undefined") {
        localStorage.setItem("lastSearchedAddress", node.id);
      }
    },
    [router]
  );

  const handleLinkClick = useCallback((link: Link) => {
    console.log('Link Details:', {
      transactionHash: link.hash,
      timestamp: link.timestamp,
      from: typeof link.source === 'object' ? link.source.id : link.source,
      to: typeof link.target === 'object' ? link.target.id : link.target,
      gasPrice: link.gasPrice,
      gasUsed: link.gasUsed,
      methodId: link.methodId,
      functionName: link.functionName
    });
  }, []);

  const nodeCanvasObject = useCallback(
    (node: Node, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const fontSize = GRAPH_CONFIG.FONT_SIZE / globalScale;
      const address = searchParams.get("address");
      const x = node.x || 0;
      const y = node.y || 0;

      ctx.beginPath();
      ctx.arc(x, y, GRAPH_CONFIG.NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = COLORS.NODE_FILL;
      ctx.fill();

      if (node.id === address || node.isCenter) {
        ctx.strokeStyle = COLORS.NODE_HIGHLIGHT;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLORS.NODE_TEXT;
      
      const displayText = node.id.substring(0, 6) + "..." + node.id.substring(node.id.length - 4);
      ctx.fillText(displayText, x, y);
    },
    [searchParams]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-white ml-4">Loading transaction data...</p>
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <p>No transaction data found for this address.</p>
      </div>
    );
  }

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      nodeRelSize={GRAPH_CONFIG.NODE_SIZE}
      nodeVal={(node) => node.val || GRAPH_CONFIG.NORMAL_NODE_VALUE}
      nodeLabel={(node): string => String(node.id)}
      onNodeClick={(node) => handleNodeClick(node as ForceGraphNode)}
      onLinkClick={(link) => handleLinkClick(link as ForceGraphLink)}
      backgroundColor={COLORS.BACKGROUND}
      nodeCanvasObject={(node, ctx, globalScale) => nodeCanvasObject(node as Node, ctx, globalScale)}
      cooldownTicks={100}
      d3AlphaDecay={0.01}
      d3VelocityDecay={0.1}
      linkColor={() => "rgba(255, 255, 255, 0.3)"}
      linkCurvature={(link) => (link as ForceGraphLink).curvature}
      linkDirectionalParticles={1}
      linkDirectionalParticleSpeed={0.005}
      linkDirectionalParticleColor={getLinkColor}
      nodeStrength={-500}
      chargeStrength={-500}
       // Add these zoom-related props
      //  zoom={GRAPH_CONFIG.ZOOM_LEVEL}
      //  minZoom={2}
      //  maxZoom={4}
      //  onEngineStop={() => {
      //   // Auto-zoom when the graph stabilizes
      //   if (fgRef.current) {
      //     fgRef.current.zoomToFit(GRAPH_CONFIG.ZOOM_DURATION, 50);
      //   }
      // }}
    />
  );
};
