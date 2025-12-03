import { generateNodeId } from "@/lib/css-generator";
import { initialValue } from "@/lib/initial-value";
import type { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FlowStore = {
  // State
  nodes: CustomNode[];
  edges: CustomEdge[];
  isExportDialogOpen: boolean;
  copied: boolean;

  // Actions
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: we need to update the node data
  updateNodeData: (nodeId: string, newData: any) => void;
  handleNodesChange: (changes: NodeChange[]) => void;
  handleEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onDrop: (event: React.DragEvent, reactFlowBounds: DOMRect) => void;
  setIsExportDialogOpen: (open: boolean) => void;
  setCopied: (copied: boolean) => void;
  importState: (nodes: CustomNode[], edges: CustomEdge[]) => void;
};

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
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
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
        const updatedEdges = applyEdgeChanges<CustomEdge>(changes, edges);
        set({ edges: updatedEdges });
      },

      onConnect: (params) => {
        const { edges } = get();
        const newEdge = addEdge<CustomEdge>(params, edges);
        set({ edges: newEdge });
      },

      onDrop: (event, reactFlowBounds) => {
        const nodeType = event.dataTransfer.getData(
          "application/reactflow"
        ) as NodeType;
        if (!nodeType) {
          return;
        }

        const position = {
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNode: CustomNode = {
          id: generateNodeId(),
          type: nodeType,
          position,
          data: (() => {
            switch (nodeType) {
              case "inputColor":
                return { name: "", color: "oklch(0.5 0.2 180)" };
              case "inputNumber":
                return { name: "", value: 0 };
              case "output":
                return { name: "", inputNodeId: "" };
              case "lighten":
                return { isDarken: false };
              case "darken":
                return { isDarken: true };
              case "saturate":
                return { isDesaturate: false };
              case "desaturate":
                return { isDesaturate: true };
              case "add":
                return { isSubtract: false };
              case "subtract":
                return { isSubtract: true };
              case "multiply":
                return { isDivide: false };
              case "divide":
                return { isDivide: true };
              default:
                return {};
            }
          })(),
        };

        const { nodes } = get();
        set({ nodes: [...nodes, newNode] });
      },

      setIsExportDialogOpen: (open) => set({ isExportDialogOpen: open }),
      setCopied: (copied) => set({ copied }),
      importState: (nodes, edges) => set({ nodes, edges }),
    }),
    {
      name: "flow-store", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist nodes and edges, not UI state
        nodes: state.nodes,
        edges: state.edges,
      }),
      // Initialize default state if this is the first time (empty persisted state)
      onRehydrateStorage: () => (state) => {
        if (state && state.nodes.length === 0 && state.edges.length === 0) {
          state.nodes = initialValue.nodes as CustomNode[];
          state.edges = initialValue.edges as CustomEdge[];
        }
      },
    }
  )
);
