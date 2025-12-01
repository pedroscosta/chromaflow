"use client";

import FlowEditor from "@/components/FlowEditor";
import Sidebar from "@/components/Sidebar";
import { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import { useCallback, useState } from "react";

export default function Home() {
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleNodesChange = useCallback((newNodes: CustomNode[]) => {
    setNodes(newNodes);
  }, []);

  const handleEdgesChange = useCallback((newEdges: CustomEdge[]) => {
    setEdges(newEdges);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar onDragStart={handleDragStart} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 border-b border-border">
          <FlowEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>

      </div>
    </div>
  );
}
