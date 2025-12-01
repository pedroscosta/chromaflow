import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { generateNodeId } from "@/lib/css-generator";
import { CustomEdge, CustomNode, NodeType } from "@/lib/types";

interface FlowStore {
  // State
  nodes: CustomNode[];
  edges: CustomEdge[];
  isExportDialogOpen: boolean;
  copied: boolean;

  // Actions
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  handleNodesChange: (changes: NodeChange[]) => void;
  handleEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onDrop: (event: React.DragEvent, reactFlowBounds: DOMRect) => void;
  setIsExportDialogOpen: (open: boolean) => void;
  setCopied: (copied: boolean) => void;
}

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  isExportDialogOpen: false,
  copied: false,

  // Actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  updateNodeData: (nodeId, newData) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    );
    set({ nodes: updatedNodes });
  },

  handleNodesChange: (changes) => {
    const { nodes } = get();
    const updatedNodes = applyNodeChanges(changes, nodes) as CustomNode[];
    set({ nodes: updatedNodes });
  },

  handleEdgesChange: (changes) => {
    const { edges } = get();
    const updatedEdges = applyEdgeChanges(changes, edges as any) as CustomEdge[];
    set({ edges: updatedEdges });
  },

  onConnect: (params) => {
    const { edges } = get();
    const newEdge = addEdge(params, edges as any) as CustomEdge[];
    set({ edges: newEdge });
  },

  onDrop: (event, reactFlowBounds) => {
    const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType;
    if (!nodeType) return;

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

    const { nodes } = get();
    set({ nodes: [...nodes, newNode] });
  },

  setIsExportDialogOpen: (open) => set({ isExportDialogOpen: open }),
  setCopied: (copied) => set({ copied }),
    }),
    {
      name: "flow-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist nodes and edges, not UI state
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);

