"use client";

import { generateNodeId } from "@/lib/css-generator";
import { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  NodeTypes,
  ReactFlowProvider,
} from "reactflow";
import { FlowProvider } from "./FlowContext";
import AddNode from "./nodes/AddNode";
import InputColorNode from "./nodes/InputColorNode";
import InputNumberNode from "./nodes/InputNumberNode";
import LightenNode from "./nodes/LightenNode";
import MixNode from "./nodes/MixNode";
import MultiplyNode from "./nodes/MultiplyNode";
import OutputNode from "./nodes/OutputNode";
import RotateNode from "./nodes/RotateNode";
import SaturateNode from "./nodes/SaturateNode";

const nodeTypes: NodeTypes = {
  inputColor: InputColorNode,
  inputNumber: InputNumberNode,
  output: OutputNode,
  lighten: LightenNode,
  darken: LightenNode,
  saturate: SaturateNode,
  desaturate: SaturateNode,
  rotate: RotateNode,
  mix: MixNode,
  add: AddNode,
  subtract: AddNode,
  multiply: MultiplyNode,
  divide: MultiplyNode,
};

interface FlowEditorProps {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: (nodes: CustomNode[]) => void;
  onEdgesChange: (edges: CustomEdge[]) => void;
}

const FlowEditor = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: FlowEditorProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as CustomNode[];
      onNodesChange(updatedNodes);
    },
    [nodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges as any) as CustomEdge[];
      onEdgesChange(updatedEdges);
    },
    [edges, onEdgesChange]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges as any) as CustomEdge[];
      onEdgesChange(newEdge);
    },
    [edges, onEdgesChange]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!nodeType || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: CustomNode = {
        id: generateNodeId(),
        type: nodeType,
        position,
        data:
          nodeType === "inputColor"
            ? { name: "", color: "oklch(0.5 0.2 180)" }
            : nodeType === "inputNumber"
            ? { name: "", value: 0 }
            : nodeType === "output"
            ? { name: "", inputNodeId: "" }
            : nodeType === "lighten" || nodeType === "darken"
            ? { isDarken: nodeType === "darken" }
            : nodeType === "saturate" || nodeType === "desaturate"
            ? { isDesaturate: nodeType === "desaturate" }
            : nodeType === "add" || nodeType === "subtract"
            ? { isSubtract: nodeType === "subtract" }
            : nodeType === "multiply" || nodeType === "divide"
            ? { isDivide: nodeType === "divide" }
            : {},
      };

      onNodesChange([...nodes, newNode]);
    },
    [nodes, onNodesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      );
      onNodesChange(updatedNodes);
    },
    [nodes, onNodesChange]
  );

  return (
    <ReactFlowProvider>
      <FlowProvider updateNodeData={updateNodeData} edges={edges}>
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes as any}
            edges={edges as any}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </FlowProvider>
    </ReactFlowProvider>
  );
};

export default FlowEditor;

