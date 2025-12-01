"use client";

import { createContext, useContext, ReactNode } from "react";
import { CustomEdge, CustomNode } from "@/lib/types";

interface FlowContextType {
  updateNodeData: (nodeId: string, newData: any) => void;
  edges: CustomEdge[];
}

const FlowContext = createContext<FlowContextType | null>(null);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within FlowProvider");
  }
  return context;
};

interface FlowProviderProps {
  children: ReactNode;
  updateNodeData: (nodeId: string, newData: any) => void;
  edges: CustomEdge[];
}

export const FlowProvider = ({ children, updateNodeData, edges }: FlowProviderProps) => {
  return (
    <FlowContext.Provider value={{ updateNodeData, edges }}>
      {children}
    </FlowContext.Provider>
  );
};

