"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateCSSVariables, generateNodeId } from "@/lib/css-generator";
import { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import { Check, Copy, Download } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
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
import DesaturateNode from "./nodes/DesaturateNode";
import DivideNode from "./nodes/DivideNode";
import InputColorNode from "./nodes/InputColorNode";
import InputNumberNode from "./nodes/InputNumberNode";
import LightenNode from "./nodes/LightenNode";
import MixNode from "./nodes/MixNode";
import MultiplyNode from "./nodes/MultiplyNode";
import OutputNode from "./nodes/OutputNode";
import RotateNode from "./nodes/RotateNode";
import SaturateNode from "./nodes/SaturateNode";
import SubtractNode from "./nodes/SubtractNode";

const nodeTypes: NodeTypes = {
  inputColor: InputColorNode,
  inputNumber: InputNumberNode,
  output: OutputNode,
  lighten: LightenNode,
  darken: LightenNode,
  saturate: SaturateNode,
  desaturate: DesaturateNode,
  rotate: RotateNode,
  mix: MixNode,
  add: AddNode,
  subtract: SubtractNode,
  multiply: MultiplyNode,
  divide: DivideNode,
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
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

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

  const handleExportClick = useCallback(() => {
    setIsExportDialogOpen(true);
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cssVariables = generateCSSVariables(nodes, edges);
  const cssExport = useMemo(() => {
    if (cssVariables.length === 0) {
      return ":root {\n  /* Add nodes to generate CSS variables */\n}";
    }
    return `:root {\n${cssVariables.map((v) => `  ${v.name}: ${v.value};`).join("\n")}\n}`;
  }, [cssVariables]);

  return (
    <ReactFlowProvider>
      <FlowProvider updateNodeData={updateNodeData} edges={edges}>
        <div className="w-full h-full flex flex-col">
          <nav className="w-full border-b bg-sidebar px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Parametric Palette Editor</h1>
            <Button onClick={handleExportClick} variant="default" size="default">
              <Download className="size-4" />
              Export
            </Button>
          </nav>
          <div className="flex-1 w-full" ref={reactFlowWrapper}>
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
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Export CSS Variables</DialogTitle>
              <DialogDescription>
                Copy the CSS variables below to use in your project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  readOnly
                  value={cssExport}
                  className="w-full h-64 p-4 bg-muted rounded-md border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.select();
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
              <Button
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </FlowProvider>
    </ReactFlowProvider>
  );
};

export default FlowEditor;

