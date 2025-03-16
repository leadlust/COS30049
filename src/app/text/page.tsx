'use client'
import React, { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

const data = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }],
  links: [
    { source: "A", target: "B", type: "friendship", curvature: 0.2 },
    { source: "A", target: "B", type: "business", curvature: -0.2 },
    { source: "B", target: "C", type: "collaboration", curvature: 0.3 },
    { source: "C", target: "D", type: "competition", curvature: -0.3 },
    { source: "D", target: "E", type: "teamwork", curvature: 0.1 }
  ]
};

const GraphComponent = () => {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current;
      
      // 🔥 Adjust node repulsion (separate all nodes)
      graph.d3Force("charge").strength(-500); // More negative = stronger repulsion

      // 🔥 Adjust link distance (minimum distance for connected nodes)
      graph.d3Force("link").distance(250); // Increase link distance to separate connected nodes
      
      // Optional: Adjust gravity (keep nodes centered but not clustered)
      graph.d3Force("center").strength(0.02); // Lower gravity = more spread-out nodes
    }
  }, []);

  const handleLinkClick = (link) => {
    console.log("Clicked link:", link);
  };

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={data}
      linkCurvature={(link) => link.curvature} // Separate multiple links
      linkDirectionalArrowLength={5} // Small arrows for clarity
      linkWidth={2}
      linkColor={(link) => (link.type === "friendship" ? "blue" : "red")}
      onLinkClick={handleLinkClick} // Handle link click
      nodeRelSize={8} // Node size
      nodeCanvasObject={(node, ctx, globalScale) => {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = `${12 / globalScale}px Sans-Serif`;
        ctx.fillText(node.id, node.x + 8, node.y + 5);
      }}
    />
  );
};

export default GraphComponent;
